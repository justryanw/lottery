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
	container.layout.setPadding(40);
	container.layout.childSpacing = 40;
	container.layout.x.childAlignment = 'center';
	container.layout.layoutDirection = 'y';


	arrayFrom(4, (i) => {
		const row = new LayoutContainer();
		container.addChild(row);
		row.layout.layoutDirection = 'x';
		row.layout.childSpacing = 10;
		row.layout.x.childAlignment = 'center';
		row.layout.y.childAlignment = 'center';

		if (i === 0 || i === 1) {
			row.layout.x.sizing = 'grow';
			row.layout.y.sizing = 'grow';
		}
		if (i === 3) {
			row.layout.x.sizing = 'grow';
			row.layout.y.sizing = 'grow';
		}

		const cells = i === 0 ? 4 : 5;

		arrayFrom(cells, (x) => {
			const cell = new LayoutContainer();
			row.addChild(cell);
			cell.layout.x.sizing = 64;
			cell.layout.y.sizing = 64;
			cell.layout.x.childAlignment = 'center';
			cell.layout.y.childAlignment = 'center';
			if (i === 0 && x === 0) {
				cell.layout.y.sizing = 150;
			}

			if (i === 1 && x === 0) {
				cell.layout.y.sizing = 110;
			}

			if (i === 0 && x === 2) {
				cell.layout.x.sizing = 'grow';
				cell.layout.y.sizing = 'grow';
				cell.layout.x.minimumLength = 138;
				cell.layout.y.minimumLength = 64;

				cell.layout.layoutDirection = 'x';
				cell.layout.x.setPadding(10);
				cell.layout.y.paddingEnd = 20;
				cell.layout.childSpacing = 10;

				arrayFrom(2, () => {
					const quadcol = new LayoutContainer();
					quadcol.layout.x.sizing = 'grow';
					quadcol.layout.y.sizing = 'grow';
					quadcol.layout.childSpacing = 10;
					cell.addChild(quadcol);

					arrayFrom(2, () => {
						const quadrow = new LayoutContainer();
						quadcol.addChild(quadrow);
						quadrow.layout.x.sizing = 'grow';
						quadrow.layout.y.sizing = 'grow';

					});
				});
			}

			if (i === 3 && (x === 1 || x === 3)) {
				cell.layout.x.sizing = 'grow';
				cell.layout.y.sizing = 'grow';
				cell.layout.x.minimumLength = 64;
				cell.layout.y.minimumLength = 64;
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
