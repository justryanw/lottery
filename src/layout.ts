import { Color, Container, Graphics } from "pixi.js";
import { isNumber } from "./utils";

interface Layout {
	direction: 'x' | 'y';
	padding: number;
	spacing: number;
	xsizing: 'fit' | 'grow' | number;
	ysizing: 'fit' | 'grow' | number;
	xcalculated: number,
	ycalculated: number,
}

function WithLayout<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TBase extends new (...args: any[]) => any
>(
	Base: TBase
) {
	return class extends Base {
		layout: Layout = {
			direction: 'y',
			padding: 0,
			spacing: 0,
			xsizing: 'fit',
			ysizing: 'fit',
			xcalculated: 0,
			ycalculated: 0,
		};
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasLayoutMixin(obj: any): obj is { layout: Layout; } {
	return 'layout' in obj;
}

export const LayoutContainer = WithLayout(Container);
// export const LayoutSprite = WithLayout(Sprite);

function sizingFitContainers(container: Container) {
	if (!hasLayoutMixin(container)) return;
	const { spacing, padding, direction } = container.layout;
	const along = direction;
	const across: 'x' | 'y' = along === 'x' ? 'y' : 'x';

	let layoutChildrenCount = 0;
	let childSizeAlong = 0;
	let maxChildSizeAcross = 0;

	container.children.forEach((child) => {
		if (!hasLayoutMixin(child)) return;
		sizingFitContainers(child)
		layoutChildrenCount++;

		if (isNumber(child.layout.xsizing)) child.layout.xcalculated = child.layout.xsizing;
		if (isNumber(child.layout.ysizing)) child.layout.ycalculated = child.layout.ysizing;

		childSizeAlong += child.layout[`${along}calculated`];
		maxChildSizeAcross = Math.max(maxChildSizeAcross, child.layout[`${across}calculated`]);
	});

	const alongSizing = container.layout[`${along}sizing`];
	if (alongSizing === 'fit' || alongSizing === 'grow') {
		container.layout[`${along}calculated`] = childSizeAlong + spacing * (layoutChildrenCount - 1) + padding * 2;
	}

	const acrossSizing = container.layout[`${across}sizing`];
	if (acrossSizing === 'fit' || alongSizing === 'grow') {
		container.layout[`${across}calculated`] = maxChildSizeAcross + padding * 2;
	}
}

function sizingGrowContainers(container: Container) {
	if (!hasLayoutMixin(container)) return;
	const { padding, spacing, direction } = container.layout;
	const along = direction;
	const across: 'x' | 'y' = along === 'x' ? 'y' : 'x';

	let layoutChildrenCount = 0;
	container.children.forEach((countChild) => {
		if (!hasLayoutMixin(countChild)) return;
		layoutChildrenCount++;
	});

	container.children.forEach((child) => {
		if (!hasLayoutMixin(child)) return;

		if (child.layout[`${along}sizing`] === 'grow') {
			// child.layout.xcalculated = 10;
			let remainingWidth = container.layout[`${along}calculated`];
			remainingWidth -= container.layout.padding * 2;
			remainingWidth -= (layoutChildrenCount - 1) * spacing;

			container.children.forEach((widthChild) => {
				if (!hasLayoutMixin(widthChild)) return;
				remainingWidth -= widthChild.layout[`${along}calculated`]
			});

			console.log(remainingWidth);
			child.layout[`${along}calculated`] = remainingWidth;
		}

		if (child.layout[`${across}sizing`] === 'grow') {
			child.layout[`${across}calculated`] = container.layout[`${across}calculated`] - padding * 2;
		}

		sizingGrowContainers(child);
	});
}

function positionContainers(container: Container) {
	if (!hasLayoutMixin(container)) return;
	const { spacing, padding, direction } = container.layout;
	const along = direction;
	const across: 'x' | 'y' = along === 'x' ? 'y' : 'x';

	let alongOffset = padding;

	container.children.forEach((child) => {
		if (!hasLayoutMixin(child)) return;

		child.position[along] = alongOffset;
		alongOffset += child.layout[`${along}calculated`] + spacing;

		child.position[across] = padding;

		positionContainers(child);
	});
}

function drawDebug(container: Container, graphics: Graphics, depth = 0) {
	if (!hasLayoutMixin(container)) return;

	const { x, y } = container.getGlobalPosition()

	const color = new Color().setValue({
		h: 40 * depth,
		s: 60,
		v: 100
	})

	const strokeColor = new Color().setValue({
		h: 40 * depth,
		s: 50,
		v: 50
	})

	graphics
		.rect(x, y, container.layout.xcalculated, container.layout.ycalculated)
		.fill({ color, alpha: 1 })
		.stroke({ width: 3, alignment: 1, color: strokeColor });

	container.children.forEach((child) => {
		if (!hasLayoutMixin(child)) return;
		drawDebug(child, graphics, depth + 1);
	});

}

export function layout(container: Container, debugGraphics?: Graphics) {
	sizingFitContainers(container);
	sizingGrowContainers(container)
	positionContainers(container);

	if (debugGraphics) drawDebug(container, debugGraphics);
}
