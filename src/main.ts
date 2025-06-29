import { Application, Graphics } from "pixi.js";
import { initDevtools } from '@pixi/devtools';
import { LayoutContainer, LayoutText, layout } from "./layout";
import { arrayFrom } from "./utils";

(async () => {
	const app = new Application();
	await app.init({ background: "#1099bb", resizeTo: window });
	document.getElementById("pixi-container")!.appendChild(app.canvas);

	initDevtools({ app });

	const debugGraphics = new Graphics();
	app.stage.addChild(debugGraphics);

	const root = new LayoutContainer();
	app.stage.addChild(root);

	const caller = new LayoutContainer();
	root.addChild(caller);
	caller.layout.y.sizing = 100;
	caller.layout.x.sizing = 'grow';
	caller.layout.y.childAlignment = 'center';
	caller.layout.x.childAlignment = 'center';

	const calls = new LayoutContainer();
	caller.addChild(calls);
	calls.layout.y.sizing = 50;
	calls.layout.x.sizing = 300;


	const numberGrid = new LayoutContainer();
	root.addChild(numberGrid);
	numberGrid.layout.y.sizing = 'grow';
	numberGrid.layout.x.sizing = 'grow';
	numberGrid.layout.x.childAlignment = 'center';
	numberGrid.layout.y.childAlignment = 'center';
	numberGrid.layout.childSpacing = 10;
	numberGrid.layout.setPadding(10);

	arrayFrom(10, (rowIndex) => {
		const row = new LayoutContainer();
		numberGrid.addChild(row);
		row.layout.layoutDirection = 'x';
		row.layout.childSpacing = 10;

		arrayFrom(rowIndex === 9 ? 5 : 6, (columnIndex) => {
			const cell = new LayoutContainer();
			row.addChild(cell);
			cell.layout.y.sizing = 40;
			cell.layout.x.sizing = 40;
			cell.layout.x.childAlignment = 'center';
			cell.layout.y.childAlignment = 'center';
			cell.layout.drawDebug = true;

			const text = new LayoutText({ text: `${rowIndex * 6 + columnIndex + 1}` })
			cell.addChild(text);
			text.style.fontSize = 18;
			text.layout.x.sizing = text.width;
			text.layout.y.sizing = text.height;
			// text.layout.drawDebug = true;
		});
	});

	// const num = new LayoutContainer();

	const menu = new LayoutContainer();
	root.addChild(menu);
	menu.layout.y.sizing = 100;
	menu.layout.x.sizing = 'grow';

	const onResize = () => {
		const { width, height } = app.renderer;
		const { x, y } = root.layout;

		x.sizing = x.length = width;
		y.sizing = y.length = height;

		const minWidth = 330;
		const minHeight = 740;

		const widthScale = Math.min(width / minWidth, 10);
		const heightScale = Math.min(height / minHeight, 10);

		const scale = Math.min(widthScale, heightScale);

		layout(root, scale, debugGraphics);
	};

	app.renderer.on('resize', onResize);
	onResize();
})();
