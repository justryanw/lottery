import { Color, Container, Graphics } from "pixi.js";
import { isNumber } from "./utils";

class Axis {
	sizing: 'fit' | 'grow' | number = 'fit';
	length: number = 0;
}

class Layout {
	layoutDirection: 'x' | 'y' = 'y';
	padding: number = 0;
	spacing: number = 0;
	x: Axis = new Axis();
	y: Axis = new Axis();

	get along() { return this.layoutDirection }
	get across() { return this.layoutDirection === 'x' ? 'y' : 'x' }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WithLayout<TBase extends new (...args: any[]) => any>(Base: TBase) {
	return class extends Base {
		layout: Layout = new Layout();
	};
}

export type ContainerWithLayout = Container & {
	layout: Layout;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasLayoutMixin(obj: any): obj is ContainerWithLayout {
	return obj && 'layout' in obj;
}

export const LayoutContainer = WithLayout(Container);
// export const LayoutSprite = WithLayout(Sprite);

function traverseLayoutContainers(
	container: Container,
	preOrder?: (container: ContainerWithLayout, depth: number) => void,
	postOrder?: (container: ContainerWithLayout, depth: number) => void,
	depth = 0,
) {
	if (!hasLayoutMixin(container)) return;
	if (preOrder) preOrder(container, depth);
	container.children.forEach((child) => traverseLayoutContainers(child, preOrder, postOrder, depth + 1));
	if (postOrder) postOrder(container, depth);
}

function sizingFitContainers(container: Container) {
	if (!hasLayoutMixin(container)) return;
	const { spacing, padding, along, across } = container.layout;

	let layoutChildrenCount = 0;
	let childSizeAlong = 0;
	let maxChildSizeAcross = 0;

	container.children.forEach((child) => {
		if (!hasLayoutMixin(child)) return;
		child.layout.x.length = 0;
		child.layout.y.length = 0;

		sizingFitContainers(child)
		layoutChildrenCount++;

		if (isNumber(child.layout.x.sizing)) child.layout.x.length = child.layout.x.sizing;
		if (isNumber(child.layout.y.sizing)) child.layout.y.length = child.layout.y.sizing;

		childSizeAlong += child.layout[along].length;
		maxChildSizeAcross = Math.max(maxChildSizeAcross, child.layout[across].length);
	});

	const alongSizing = container.layout[along].sizing;
	if (alongSizing === 'fit') {
		container.layout[along].length = childSizeAlong + spacing * (layoutChildrenCount - 1) + padding * 2;
	}

	const acrossSizing = container.layout[across].sizing;
	if (acrossSizing === 'fit') {
		container.layout[across].length = maxChildSizeAcross + padding * 2;
	}
}

function sizingGrowContainers(container: Container) {
	if (!hasLayoutMixin(container)) return;
	const { padding, spacing, along, across } = container.layout;

	let layoutChildrenCount = 0;
	container.children.forEach((countChild) => {
		if (!hasLayoutMixin(countChild)) return;
		layoutChildrenCount++;
	});

	container.children.forEach((child) => {
		if (!hasLayoutMixin(child)) return;

		if (child.layout[along].sizing === 'grow') {
			let remainingWidth = container.layout[along].length;
			remainingWidth -= container.layout.padding * 2;
			remainingWidth -= (layoutChildrenCount - 1) * spacing;

			container.children.forEach((widthChild) => {
				if (!hasLayoutMixin(widthChild)) return;
				remainingWidth -= widthChild.layout[along].length;
			});

			child.layout[along].length = remainingWidth;
		}

		if (child.layout[across].sizing === 'grow') {
			child.layout[across].length = container.layout[across].length - padding * 2;
		}

		sizingGrowContainers(child);
	});
}

function positionContainers(container: Container) {
	if (!hasLayoutMixin(container)) return;
	const { spacing, padding, along, across } = container.layout;

	let alongOffset = padding;

	container.children.forEach((child) => {
		if (!hasLayoutMixin(child)) return;

		child.position[along] = alongOffset;
		alongOffset += child.layout[along].length + spacing;

		child.position[across] = padding;

		positionContainers(child);
	});
}

function drawDebug(root: Container, graphics: Graphics) {
	traverseLayoutContainers(root, (container, depth) => {
		const { x, y } = container.getGlobalPosition()

		const color = new Color().setValue({ h: 40 * depth, s: 60, v: 100 });
		const strokeColor = new Color().setValue({ h: 40 * depth, s: 50, v: 50 });

		graphics
			.rect(x, y, container.layout.x.length, container.layout.y.length)
			.fill({ color, alpha: 1 })
			.stroke({ width: 3, alignment: 1, color: strokeColor });
	});
}

export function layout(container: Container, debugGraphics?: Graphics) {
	sizingFitContainers(container);
	sizingGrowContainers(container)
	positionContainers(container);

	if (debugGraphics) drawDebug(container, debugGraphics);
}
