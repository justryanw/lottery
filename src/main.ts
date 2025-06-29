import { Application, Container, Graphics } from "pixi.js";
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
		row.layout.layoutDirection = 'x';
		row.layout.spacing = 10;

		if (i === 0) row.layout.x.sizing = 'grow';
		if (i === 1) row.layout.x.sizing = 500;
		if (i === 5) {
			row.layout.x.sizing = 'grow';
			row.layout.y.sizing = 'grow';
		}

		const cells = i === 0 ? 4 : 5;

		arrayFrom(cells, (x) => {
			const cell = new LayoutContainer();
			cell.layout.x.sizing = 64;
			cell.layout.y.sizing = 64;

			if (i === 0 && x === 2) {
				cell.layout.x.sizing = 'grow';
				cell.layout.y.sizing = 'grow';

				const nonLayout = new Container();
				cell.addChild(nonLayout);
			}

			if (i === 5 && x === 3) {
				cell.layout.x.sizing = 'grow';
				cell.layout.y.sizing = 'grow';
			}

			row.addChild(cell);
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
