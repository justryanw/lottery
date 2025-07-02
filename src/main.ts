import { Application, Graphics } from "pixi.js";
import { initDevtools } from '@pixi/devtools';
import { Root } from "./components/root";
import { layout } from "./layout";
import { DebugText } from "./debug-text";

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

	const root = new Root(app.stage);

	const debugText = new DebugText(app.stage);

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

		layout(root, scale, debugGraphics);

		debugText.draw(scale, app.renderer);
	};

	app.renderer.on('resize', onResize);
	onResize();
})();
