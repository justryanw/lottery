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
	container.layout.layoutDirection = 'y';


	arrayFrom(7, (i) => {
		const row = new LayoutContainer();
		container.addChild(row);
		row.layout.layoutDirection = 'x';
		row.layout.spacing = 10;

		if (i === 0) {
			row.layout.x.sizing = 'grow';
			row.layout.y.sizing = 'grow';
		}
		if (i === 5) {
			row.layout.x.sizing = 'grow';
			row.layout.y.sizing = 'grow';
		}

		const cells = i === 0 ? 4 : 5;

		arrayFrom(cells, (x) => {
			const cell = new LayoutContainer();
			row.addChild(cell);
			cell.layout.x.sizing = 64;
			cell.layout.y.sizing = 64;
			if (i === 0 && x === 0) {
				cell.layout.y.sizing = 150;
			}

			if (i === 0 && x === 2) {
				cell.layout.x.sizing = 'grow';
				cell.layout.y.sizing = 'grow';
			}

			if (i === 5 && (x === 1 || x === 3)) {
				cell.layout.x.sizing = 'grow';
				cell.layout.y.sizing = 'grow';
			}

		});
	})

	debugGraphics.alpha = 1;

	const onResize = () => {
		debugGraphics.clear();
		container.layout.x.sizing = container.layout.x.length = app.renderer.width;
		container.layout.y.sizing = container.layout.y.length = app.renderer.height;
		layout(container, debugGraphics)
	};

	app.renderer.on('resize', onResize);
	onResize();
})();
