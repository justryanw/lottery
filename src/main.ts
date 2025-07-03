import { Application, Assets } from "pixi.js";
import { initDevtools } from '@pixi/devtools';
import { Root } from "./components/root";
import { layout } from "./layout";
import { DebugGraphics, DebugText } from "./debug";
import { Game } from "./game";
import { TestServer } from "./server-adaptors/test-server";
import { manifest } from "./manifest";
import { THEME } from "./colors";

const DRAW_DEBUG_TEXT = false;
const DRAW_DEBUG_GRAPHICS = true;
export const DRAW_ALL_CONTAINERS = false;

export let SCALE: number;

(async () => {
	const app = new Application();
	await app.init({
		background: THEME.background,
		antialias: true,
		resizeTo: window,
		autoDensity: true,
	});
	document.getElementById("app")!.appendChild(app.canvas);

	initDevtools({ app });

	await Assets.init({ manifest });
	await Assets.loadBundle("game");

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

		SCALE = Math.min(widthScale, heightScale);

		layout(root, SCALE);

		if (debugText) debugText.draw(SCALE, app.renderer);
		if (debugGraphics) debugGraphics.draw(root, SCALE)
	};

	app.renderer.on('resize', onResize);
	onResize();

	const server = new TestServer();
	const game = new Game(server);
	await game.play();
})();
