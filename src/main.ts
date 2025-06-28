import { Application, Assets, Color, Container, Graphics, Sprite } from "pixi.js";
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
const LayoutSprite = WithLayout(Sprite);

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

function drawDebug(container: Container, graphics: Graphics) {
	if (!hasLayoutMixin(container)) return;

	const { x, y } = container.getGlobalPosition()

	graphics
		.fill({ color: getRandomHSLColor(), alpha: 1 })
		.rect(x, y, container.layout.xcalculated, container.layout.ycalculated);

	container.children.forEach((child) => {
		if (!hasLayoutMixin(child)) return;
		drawDebug(child, graphics);
	});

}

function getRandomHSLColor() {
	return new Color().setValue({
		r: Math.random() * 255,
		g: Math.random() * 255,
		b: Math.random() * 255,
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
	app.renderer.on('resize', () => layout(app.stage));

	const container = new LayoutContainer();
	app.stage.addChild(container);
	container.layout.padding = 2;
	container.layout.spacing = 2;

	const texture = await Assets.load("/assets/bunny.png");

	const rows = Array.from({ length: 5 }, () => {
		const row = new LayoutContainer();
		container.addChild(row);
		row.layout.direction = 'x';
		row.layout.spacing = 2;

		Array.from({ length: 5 }, () => {
			const bunny = new LayoutSprite(texture);
			bunny.layout.xsizing = texture.width;
			bunny.layout.ysizing = texture.height;
			row.addChild(bunny);
		})

		return row;
	})

	const debugGraphics = new Graphics();
	app.stage.addChild(debugGraphics);
	layout(container, debugGraphics);

	console.log(rows.map((row) => row.layout));
	console.log(container.layout);
})();
