import { Application, Graphics, Text } from "pixi.js";
import { initDevtools } from '@pixi/devtools';
import { LayoutContainer, layout } from "./layout";
import { arrayFrom } from "./utils";
import { LotteryNumber } from "./components/lotteryNumber";

(async () => {
	const app = new Application();
	await app.init({
		background: "#1099bb",
		antialias: true,
		resizeTo: window,
		autoDensity: true,
	});
	document.getElementById("app")!.appendChild(app.canvas);

	initDevtools({ app });

	const debugGraphics = new Graphics();
	app.stage.addChild(debugGraphics);

	const root = new LayoutContainer();
	app.stage.addChild(root);

	const debugText = new Text({ text: "hi" });
	app.stage.addChild(debugText);
	debugText.style.fill = 'white';
	debugText.style.stroke = 'black';
	debugText.style.fontWeight = 'bold';

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
			new LotteryNumber(row, rowIndex * 6 + columnIndex + 1);
		});
	});

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

		app.renderer.resolution = window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;

		debugText.position.set(10 * scale);
		debugText.style.fontSize = 14 * scale;
		debugText.text = `window
width: ${window.innerWidth.toFixed(2)}
height: ${window.innerHeight.toFixed(2)}
dpr: ${window.devicePixelRatio.toFixed(2)}

renderer
width: ${width.toFixed(2)}
height: ${height.toFixed(2)}
resolution: ${app.renderer.resolution.toFixed(2)}

scale: ${scale.toFixed(2)}`;


		layout(root, scale, debugGraphics);
	};

	app.renderer.on('resize', onResize);
	onResize();
})();
