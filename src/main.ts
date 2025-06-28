import { Application, Graphics } from "pixi.js";
import { initDevtools } from '@pixi/devtools';
import { LayoutContainer, layout } from "./layout";
import { arrayFrom } from "./utils";

(async () => {
	const app = new Application();
	await app.init({ background: "#1099bb", resizeTo: window });
	document.getElementById("pixi-container")!.appendChild(app.canvas);

	initDevtools({ app });

	const debugGraphics = new Graphics();
	app.stage.addChild(debugGraphics);

	const container = new LayoutContainer();
	app.stage.addChild(container);
	container.layout.padding = 10;
	container.layout.spacing = 10;

	arrayFrom(10, (i) => {
		const row = new LayoutContainer();
		container.addChild(row);
		row.layout.direction = 'x';
		row.layout.spacing = 10;

		if (i === 0) {
			row.layout.xsizing = 'grow';
		}
		if (i === 1) {
			row.layout.xsizing = 500;
		}
		const cells = i === 0 ? 4 : 5;

		arrayFrom(cells, (x) => {
			const cell = new LayoutContainer();
			cell.layout.xsizing = 64;
			cell.layout.ysizing = 64;

			if (i === 0 && x === 2) {
				cell.layout.xsizing = 'grow';
				cell.layout.ysizing = 'grow';
			}

			row.addChild(cell);
		});
	})

	debugGraphics.alpha = 1;

	layout(container, debugGraphics);
	app.renderer.on('resize', () => {
		debugGraphics.clear();
		layout(container, debugGraphics)
	});
})();
