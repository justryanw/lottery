import { Application } from "pixi.js";
import { initDevtools } from '@pixi/devtools';
import { Root } from "./components/root";
import { layout } from "./layout";
import { DebugGraphics, DebugText } from "./debug";
import { Game } from "./game";
import { TestServer } from "./server-adaptors/test-server";

const DRAW_DEBUG_TEXT = false;
const DRAW_DEBUG_GRAPHICS = true;
export const DRAW_ALL_CONTAINERS = false;

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


	const root = new Root(app.stage);

	let debugGraphics: DebugGraphics;
	if (DRAW_DEBUG_GRAPHICS) debugGraphics = new DebugGraphics(app.stage);

	let debugText: DebugText;
	if (DRAW_DEBUG_TEXT) debugText = new DebugText(app.stage);

	const onResize = () => {
		const { width, height } = app.renderer;
		const { x, y } = root.layout;

		app.renderer.resolution = window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;

		x.sizing = x.length = width;
		y.sizing = y.length = height;

		const minWidth = 330;
		const minHeight = 740;

		const widthScale = Math.min(width / minWidth, 10);
		const heightScale = Math.min(height / minHeight, 10);

		const scale = Math.min(widthScale, heightScale);

		layout(root, scale);

		if (debugText) debugText.draw(scale, app.renderer);
		if (debugGraphics) debugGraphics.draw(root, scale)
	};

	app.renderer.on('resize', onResize);
	onResize();

	const server = new TestServer();
	const game = new Game(server);
	await game.play();
})();
