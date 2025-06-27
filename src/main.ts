import { Application, Assets, Sprite } from "pixi.js";


(async () => {
	const app = new Application();
	await app.init({ background: "#1099bb", resizeTo: window });
	document.getElementById("pixi-container")!.appendChild(app.canvas);

	const texture = await Assets.load("/assets/bunny.png");

	const bunny = new Sprite(texture);
	bunny.anchor.set(0.5);

	app.stage.addChild(bunny);

	app.ticker.add((time) => {
		bunny.rotation += 0.1 * time.deltaTime;
	});
})();
