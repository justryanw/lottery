import { Color, Container, Graphics } from "pixi.js";
import { isNumber } from "./utils";

const SCALING = 1;

class Axis {
	sizing: 'fit' | 'grow' | number = 'fit';
	minimumLength: number = 0;
	childAlignment: 'start' | 'center' | 'end' = 'start';
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

type ContainerWithLayout = Container & {
	layout: Layout;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasLayoutMixin(obj: any): obj is ContainerWithLayout {
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

function getRemainingAlongLength({ layout }: ContainerWithLayout, children: ContainerWithLayout[]) {
	const { along, padding, spacing } = layout;
	let remainingLength = layout[along].length;
	remainingLength -= padding * 2 * SCALING;
	remainingLength -= spacing * (children.length - 1) * SCALING;
	children.forEach((child) => remainingLength -= child.layout[along].length);
	return remainingLength;
}

function sizingFitContainers(root: Container) {
	traverseLayoutContainers(root, ({ layout, parent }) => {
		// Reset all calcualted sizes and set fixed sizes.
		const { x, y } = layout;
		if (!hasLayoutMixin(parent)) return;
		x.length = isNumber(x.sizing) ? x.sizing * SCALING : x.minimumLength;
		y.length = isNumber(y.sizing) ? y.sizing * SCALING : y.minimumLength;

	}, ({ layout, children }) => {
		// Calculate the minimum size of the container to fit all its children, padding and spacing.
		const { along, across, spacing, padding } = layout;

		let childSizeAlong = 0;
		let maxChildSizeAcross = 0;

		const layoutChildren = children.filter(hasLayoutMixin);

		layoutChildren.forEach((child) => {
			childSizeAlong += child.layout[along].length;
			maxChildSizeAcross = Math.max(maxChildSizeAcross, child.layout[across].length);
		});

		const childSpacing = spacing * (layoutChildren.length - 1);

		if (layout[along].sizing === 'fit' || layout[along].sizing === 'grow') layout[along].length = Math.max(childSizeAlong + (childSpacing + padding * 2) * SCALING, layout[along].length);
		if (layout[across].sizing === 'fit' || layout[across].sizing === 'grow') layout[across].length = Math.max(maxChildSizeAcross + padding * 2 * SCALING, layout[across].length);
	});
}

function sizingGrowContainers(root: Container) {
	traverseLayoutContainers(root, (container) => {
		const { layout, children } = container;
		const { along, across, padding } = layout;

		const layoutChildren = children.filter(hasLayoutMixin);
		const growAlong = layoutChildren.filter((child) => child.layout[along].sizing === 'grow');
		const growAcross = layoutChildren.filter((child) => child.layout[across].sizing === 'grow');

		let remainingLength = getRemainingAlongLength(container, layoutChildren);

		// Evenly divide remaning length to all grow children.
		let maxIters = 100;
		while (growAlong.length > 0 && remainingLength > 0.1 && maxIters > 0) {
			maxIters--;
			if (maxIters === 0) console.log("Grow sizing hit max iters!");

			let smallestLength = growAlong[0].layout[along].length;
			let secondSmallestLength = Infinity;
			let widthToAdd = remainingLength;

			// Find smallest and second smallest child lengths.
			// Make widthToAdd the difference between them.
			growAlong.forEach((child) => {
				if (child.layout[along].length < smallestLength) {
					secondSmallestLength = smallestLength;
					smallestLength = child.layout[along].length;
				} else if (child.layout[along].length > smallestLength) {
					secondSmallestLength = Math.min(secondSmallestLength, child.layout[along].length);
					widthToAdd = secondSmallestLength - smallestLength;
				}
			});

			widthToAdd = Math.min(widthToAdd, remainingLength / growAlong.length);

			// Add the difference between the second smallest and smallest to the smallest child so that they are equal.
			growAlong.forEach((child) => {
				if (child.layout[along].length === smallestLength) {
					child.layout[along].length += widthToAdd;
					remainingLength -= widthToAdd;
				}
			});
		}

		growAcross.forEach((child) => {
			child.layout[across].length = Math.max(child.layout[across].length, layout[across].length - padding * 2 * SCALING);
		});
	});
}

function positionAndAlignContainers(root: Container) {
	traverseLayoutContainers(root, (container) => {
		const { layout, children } = container;
		const { along, across, padding, spacing } = layout;

		const layoutChildren = children.filter(hasLayoutMixin);

		const alongAlignmentMultiplier = layout[along].childAlignment === 'start' ? 0 : layout[along].childAlignment === 'center' ? 0.5 : 1;
		const acrossAlignmentMultiplier = layout[across].childAlignment === 'start' ? 0 : layout[across].childAlignment === 'center' ? 0.5 : 1;

		const remainingLength = getRemainingAlongLength(container, layoutChildren);
		let alongOffset = padding * SCALING + remainingLength * alongAlignmentMultiplier;

		layoutChildren.forEach((child) => {
			child.position[along] = alongOffset;
			alongOffset += child.layout[along].length + spacing * SCALING;

			const remainingAcross = layout[across].length - (child.layout[across].length + padding * SCALING * 2);
			child.position[across] = padding * SCALING + remainingAcross * acrossAlignmentMultiplier;
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
	positionAndAlignContainers(root);

	if (debugGraphics) drawDebug(root, debugGraphics);
}
