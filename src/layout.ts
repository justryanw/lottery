import { Color, Container, Graphics } from "pixi.js";
import { isNumber } from "./utils";

export let SCALING = 1;

class Axis {
	sizing: 'fit' | 'grow' | number = 'fit';
	childAlignment: 'start' | 'center' | 'end' = 'start';
	paddingStart = 0;
	paddingEnd = 0;
	minimumLength = 0;
	length = 0;

	padding() { return this.paddingStart + this.paddingEnd; }
	setPadding(padding: number) { this.paddingStart = this.paddingEnd = padding; }
}

class Layout {
	layoutDirection: 'x' | 'y' = 'y';
	childSpacing = 0;
	x = new Axis();
	y = new Axis();

	get along() { return this.layoutDirection }
	get across() { return this.layoutDirection === 'x' ? 'y' : 'x' }

	setPadding(padding: number) {
		this.x.setPadding(padding);
		this.y.setPadding(padding);
	}
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

function getRemainingAlongLength({ layout }: ContainerWithLayout, children: ContainerWithLayout[], scale: number) {
	const { along, childSpacing } = layout;
	let remainingLength = layout[along].length;
	remainingLength -= layout[along].padding() * scale;
	remainingLength -= childSpacing * (children.length - 1) * scale;
	children.forEach((child) => remainingLength -= child.layout[along].length);
	return remainingLength;
}

function fitContainers(root: Container, scale: number) {
	traverseLayoutContainers(root, ({ layout, parent }) => {
		// Reset all calcualted sizes and set fixed sizes.
		const { x, y } = layout;
		if (!hasLayoutMixin(parent)) return;
		x.length = (isNumber(x.sizing) ? x.sizing : x.minimumLength) * scale;
		y.length = (isNumber(y.sizing) ? y.sizing : y.minimumLength) * scale;

	}, ({ layout, children }) => {
		// Calculate the minimum size of the container to fit all its children, padding and spacing.
		const { along, across, childSpacing } = layout;

		let childSizeAlong = 0;
		let maxChildSizeAcross = 0;

		const layoutChildren = children.filter(hasLayoutMixin);

		layoutChildren.forEach((child) => {
			childSizeAlong += child.layout[along].length;
			maxChildSizeAcross = Math.max(maxChildSizeAcross, child.layout[across].length);
		});

		const totalChildSpacing = childSpacing * (layoutChildren.length - 1);

		if (layout[along].sizing === 'fit' || layout[along].sizing === 'grow')
			layout[along].length = Math.max(childSizeAlong + (totalChildSpacing + layout[along].padding()) * scale, layout[along].length);
		if (layout[across].sizing === 'fit' || layout[across].sizing === 'grow')
			layout[across].length = Math.max(maxChildSizeAcross + layout[across].padding() * scale, layout[across].length);
	});
}

function growContainers(root: Container, scale: number) {
	traverseLayoutContainers(root, (container) => {
		const { layout, children } = container;
		const { along, across } = layout;

		const layoutChildren = children.filter(hasLayoutMixin);
		const growAlong = layoutChildren.filter((child) => child.layout[along].sizing === 'grow');
		const growAcross = layoutChildren.filter((child) => child.layout[across].sizing === 'grow');

		let remainingLength = getRemainingAlongLength(container, layoutChildren, scale);

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
			child.layout[across].length = Math.max(child.layout[across].length, layout[across].length - layout[across].padding() * scale);
		});
	});
}

function positionContainers(root: Container, scale: number) {
	traverseLayoutContainers(root, (container) => {
		const { layout, children } = container;
		const { along, across, childSpacing } = layout;

		const layoutChildren = children.filter(hasLayoutMixin);

		const alongAlignmentMultiplier = layout[along].childAlignment === 'start' ? 0 : layout[along].childAlignment === 'center' ? 0.5 : 1;
		const acrossAlignmentMultiplier = layout[across].childAlignment === 'start' ? 0 : layout[across].childAlignment === 'center' ? 0.5 : 1;

		const remainingLength = getRemainingAlongLength(container, layoutChildren, scale);
		let alongOffset = layout[along].paddingStart * scale + remainingLength * alongAlignmentMultiplier;

		layoutChildren.forEach((child) => {
			child.position[along] = alongOffset;
			alongOffset += child.layout[along].length + childSpacing * scale;

			const remainingAcross = layout[across].length - (child.layout[across].length + layout[across].padding() * scale);
			child.position[across] = layout[across].paddingStart * scale + remainingAcross * acrossAlignmentMultiplier;
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

export function layout(root: Container, scale: number = 1, debugGraphics?: Graphics) {
	fitContainers(root, scale);
	growContainers(root, scale);
	positionContainers(root, scale);

	if (debugGraphics) {
		debugGraphics.clear();
		drawDebug(root, debugGraphics);
	}
}
