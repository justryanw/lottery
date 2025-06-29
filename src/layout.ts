import { Color, Container, Graphics } from "pixi.js";
import { isNumber } from "./utils";

const SCALING = 1;

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

function sizingFitContainers(root: Container) {
	traverseLayoutContainers(root, ({ layout, parent }) => {
		// Reset all calcualted sizes and set fixed sizes
		const { x, y } = layout;
		if (!hasLayoutMixin(parent)) return;
		x.length = isNumber(x.sizing) ? x.sizing * SCALING : 0;
		y.length = isNumber(y.sizing) ? y.sizing * SCALING : 0;

	}, ({ layout, children }) => {
		// Calculate the minimum size of the container to fit all its children, padding and spacing
		const { along, across, spacing, padding } = layout;

		let childSizeAlong = 0;
		let maxChildSizeAcross = 0;

		const layoutChildren = children.filter(hasLayoutMixin);

		layoutChildren.forEach((child) => {
			childSizeAlong += child.layout[along].length;
			maxChildSizeAcross = Math.max(maxChildSizeAcross, child.layout[across].length);
		});

		const childSpacing = spacing * (layoutChildren.length - 1);

		if (layout[along].sizing === 'fit' || layout[along].sizing === 'grow') layout[along].length = childSizeAlong + (childSpacing + padding * 2) * SCALING;
		if (layout[across].sizing === 'fit' || layout[across].sizing === 'grow') layout[across].length = maxChildSizeAcross + padding * 2 * SCALING;
	});
}

function sizingGrowContainers(root: Container) {
	traverseLayoutContainers(root, ({ layout, children }) => {
		const { along, across, padding, spacing } = layout;

		const layoutChildren = children.filter(hasLayoutMixin);
		const growAlong = layoutChildren.filter((child) => child.layout[along].sizing === 'grow');
		const growAcross = layoutChildren.filter((child) => child.layout[across].sizing === 'grow');

		let remainingWidth = layout[along].length;
		remainingWidth -= padding * 2 * SCALING;
		remainingWidth -= spacing * (layoutChildren.length - 1) * SCALING;

		layoutChildren.forEach((child) => remainingWidth -= child.layout[along].length);

		let maxIters = 100;

		while (growAlong.length > 0 && remainingWidth > 0.01 && maxIters > 0) {
			maxIters--;
			if (maxIters === 0) console.log("Grow sizing hit max iters!");
			let smallest = growAlong[0].layout[along].length;
			let secondSmallest = Infinity;
			let widthToAdd = remainingWidth

			growAlong.forEach((growChild) => {
				if (growChild.layout[along].length < smallest) {
					secondSmallest = smallest;
					smallest = growChild.layout[along].length;
				} else if (growChild.layout[along].length > smallest) {
					secondSmallest = Math.min(secondSmallest, growChild.layout[along].length);
					widthToAdd = secondSmallest - smallest;
				}
			});

			widthToAdd = Math.min(widthToAdd, remainingWidth / growAlong.length);

			growAlong.forEach((child) => {
				if (child.layout[along].length === smallest) {
					child.layout[along].length += widthToAdd;
					remainingWidth -= widthToAdd;
				}
			});
		}

		growAcross.forEach((child) => {
			child.layout[across].length = Math.max(child.layout[across].length, layout[across].length - padding * 2 * SCALING);
		});
	});
}

function positionContainers(root: Container) {
	traverseLayoutContainers(root, ({ layout, children }) => {
		const { along, across, padding, spacing } = layout;

		let alongOffset = padding * SCALING;

		children.filter(hasLayoutMixin).forEach((child) => {
			child.position[along] = alongOffset;
			alongOffset += child.layout[along].length + spacing * SCALING;

			child.position[across] = padding * SCALING;
		});
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
			.stroke({ width: 3 * SCALING, alignment: 1, color: strokeColor });
	});
}

export function layout(root: Container, debugGraphics?: Graphics) {
	sizingFitContainers(root);
	sizingGrowContainers(root);
	positionContainers(root);

	if (debugGraphics) drawDebug(root, debugGraphics);
}
