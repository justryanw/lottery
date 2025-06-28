import { Application, Color, Container, Graphics } from "pixi.js";
import { initDevtools } from '@pixi/devtools';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isNumber = (val: any) => typeof val === "number";

interface Layout {
	direction: 'x' | 'y';
	padding: number;
	spacing: number;
	xsizing: 'fit' | number;
	ysizing: 'fit' | number;
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
function hasLayoutMixin(obj: any): obj is { layout: Layout; } {
	return 'layout' in obj;
}

const LayoutContainer = WithLayout(Container);
// const LayoutSprite = WithLayout(Sprite);

function sizeContainers(container: Container) {
	if (!hasLayoutMixin(container)) return;
	const { spacing, padding, direction } = container.layout;
	const along = direction;
	const across: 'x' | 'y' = along === 'x' ? 'y' : 'x';

	let layoutChildrenCount = 0;
	let childSizeAlong = 0;
	let maxChildSizeAcross = 0;

	container.children.forEach((child) => {
		if (!hasLayoutMixin(child)) return;
		sizeContainers(child)
		layoutChildrenCount++;

		if (isNumber(child.layout.xsizing)) child.layout.xcalculated = child.layout.xsizing;
		if (isNumber(child.layout.ysizing)) child.layout.ycalculated = child.layout.ysizing;

		childSizeAlong += child.layout[`${along}calculated`];
		maxChildSizeAcross = Math.max(maxChildSizeAcross, child.layout[`${across}calculated`]);
	});

	if (container.layout[`${along}sizing`] === 'fit') {
		container.layout[`${along}calculated`] = childSizeAlong + spacing * (layoutChildrenCount - 1) + padding * 2;
	}

	if (container.layout[`${across}sizing`] === 'fit') {
		container.layout[`${across}calculated`] = maxChildSizeAcross + padding * 2;
	}
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

function layout(container: Container, debugGraphics?: Graphics) {
	sizeContainers(container);
	positionContainers(container);

	if (debugGraphics) drawDebug(container, debugGraphics);
}

(async () => {
	const app = new Application();
	await app.init({ background: "#1099bb", resizeTo: window });
	initDevtools({ app });


	document.getElementById("pixi-container")!.appendChild(app.canvas);
	const debugGraphics = new Graphics();
	app.stage.addChild(debugGraphics);

	const container = new LayoutContainer();
	app.stage.addChild(container);
	container.layout.padding = 10;
	container.layout.spacing = 20;

	// const texture = await Assets.load("/assets/bunny.png");

	const rows = Array.from({ length: 10 }, (_, i) => {
		const row = new LayoutContainer();
		container.addChild(row);
		row.layout.direction = 'x';
		row.layout.spacing = 20;

		const cells = i === 0 ? 4 : 5;

		Array.from({ length: cells }, () => {
			const cell = new LayoutContainer();
			cell.layout.xsizing = 60;
			cell.layout.ysizing = 60;

			row.addChild(cell);
		})

		return row;
	})

	debugGraphics.alpha = 1;

	layout(container, debugGraphics);
	app.renderer.on('resize', () => {
		debugGraphics.clear();
		layout(container, debugGraphics)
	});

	console.log(rows.map((row) => row.layout));
	console.log(container.layout);
})();
