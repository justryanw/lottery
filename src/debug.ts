
import { Color, Container, Graphics, Renderer, Text } from "pixi.js";
import { traverseLayoutContainers } from "./layout";
import { DRAW_ALL_CONTAINERS } from "./main";

export class DebugText extends Text {
	constructor(parent: Container) {
		super();
		parent.addChild(this);

		this.style.fill = 'white';
		this.style.stroke = 'black';
		this.style.fontWeight = 'bold';
	}

	public draw(scale: number, { width, height, resolution }: Renderer) {
		this.position.set(10 * scale);
		this.style.fontSize = 18 * scale;
		this.style.stroke = { color: 'black', width: 2 * scale };

		this.text = [
			'window',
			`width: ${window.innerWidth.toFixed(2)}`,
			`height: ${window.innerHeight.toFixed(2)}`,
			`dpr: ${window.devicePixelRatio.toFixed(2)}`,
			'',
			'renderer',
			`width: ${width.toFixed(2)}`,
			`height: ${height.toFixed(2)}`,
			`resolution: ${resolution.toFixed(2)}`,
			'',
			`scale: ${scale.toFixed(2)}`,
		].join('\n');
	}
}

export class DebugGraphics extends Graphics {
	constructor(parent: Container) {
		super();
		parent.addChild(this);
	}

	draw(root: Container, scale: number) {
		traverseLayoutContainers(root, (container, depth) => {
			if (!DRAW_ALL_CONTAINERS && !container.layout.drawDebug) return;
			const { x, y } = container.getGlobalPosition()

			const color = new Color().setValue({ h: 40 * depth, s: 60, v: 100 });
			const strokeColor = new Color().setValue({ h: 40 * depth, s: 50, v: 50 });

			this.rect(x, y, container.layout.x.length, container.layout.y.length)
				.fill({ color, alpha: 1 })
				.stroke({ width: 3 * scale, alignment: 1, color: strokeColor });
		});
	}
}
