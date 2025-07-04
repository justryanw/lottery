import { Application, Assets } from "pixi.js";
import { initDevtools } from '@pixi/devtools';
import { Root } from "./components/root";
import { layout } from "./layout";
import { DebugGraphics, DebugText } from "./debug";
import { Game } from "./game";
import { TestServer } from "./server-adaptors/test-server";
import { manifest } from "./manifest";
import { THEME } from "./colors";
import { arrayFrom } from "./utils";
import { Result } from "typescript-result";

const DRAW_DEBUG_TEXT = false;
const DRAW_DEBUG_GRAPHICS = true;
export const DRAW_ALL_CONTAINERS = false;

export const NUMBERS = arrayFrom(59, (i) => i + 1);

export let GAME: Game;
export let UI: Root;

export let REDRAW: () => void;

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

	UI = new Root(app.stage);

	let debugGraphics: DebugGraphics;
	if (DRAW_DEBUG_GRAPHICS) debugGraphics = new DebugGraphics(app.stage);

	let debugText: DebugText;
	if (DRAW_DEBUG_TEXT) debugText = new DebugText(app.stage);

	const onResize = () => {
		const { width, height } = app.renderer;
		const { x, y } = UI.layout;

		app.renderer.resolution = window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;

		x.sizing = x.length = width;
		y.sizing = y.length = height;

		const minWidth = 330;
		const minHeight = 740;

		const widthScale = Math.min(width / minWidth, 10);
		const heightScale = Math.min(height / minHeight, 10);

		const scale = Math.min(widthScale, heightScale);

		layout(UI, scale);

		if (debugText) debugText.draw(scale, app.renderer);
		if (debugGraphics) debugGraphics.draw(UI, scale)
	};

	app.renderer.on('resize', onResize);
	onResize();
	REDRAW = onResize;

	const server = new TestServer();

	const session = await Result.fromAsync(server.getSession()).getOrThrow();

	GAME = new Game(server, session);
})();
