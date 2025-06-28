import { Application, Assets, Container, Sprite } from "pixi.js";

interface Layout {
	direction: 'vertical' | 'horizontal';
	padding: number;
	spacing: number;
}

function WithLayout<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TBase extends new (...args: any[]) => any
>(
	Base: TBase
) {
	return class extends Base {
		layout: Layout = {
			direction: 'vertical',
			padding: 0,
			spacing: 0,
		};
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasLayoutMixin(obj: any): obj is { layout: Layout; } {
	return 'layout' in obj;
}

const LayoutContainer = WithLayout(Container);
const LayoutSprite = WithLayout(Sprite);

function layout(container: Container) {

	if (hasLayoutMixin(container)) {
		let offset = container.layout.padding;
		container.children.forEach((child) => {
			if (hasLayoutMixin(child)) {
				child.y = container.layout.padding;
				child.x = offset;
				offset += child.width + container.layout.spacing;
			}
		});
	}

	container.children.forEach((child) => layout(child));
}

(async () => {
	const app = new Application();
	await app.init({ background: "#1099bb", resizeTo: window });
	document.getElementById("pixi-container")!.appendChild(app.canvas);
	app.renderer.on('resize', () => layout(app.stage));

	const container = new LayoutContainer();
	app.stage.addChild(container);
	container.layout.padding = 10;
	container.layout.spacing = 2;

	const texture = await Assets.load("/assets/bunny.png");

	const bunny = new LayoutSprite(texture);
	container.addChild(bunny);

	Array.from({ length: 5 }, () => {
		const bunny2 = new LayoutSprite(texture);
		container.addChild(bunny2);
	})

	// app.ticker.add((time) => {
	// 	bunny.rotation += 0.1 * time.deltaTime;
	// });

	layout(app.stage);
})();
