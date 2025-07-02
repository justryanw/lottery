
import { Container, Renderer, Text } from "pixi.js";

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
		this.style.fontSize = 14 * scale;
		this.text = `window
width: ${window.innerWidth.toFixed(2)}
height: ${window.innerHeight.toFixed(2)}
dpr: ${window.devicePixelRatio.toFixed(2)}

renderer
width: ${width.toFixed(2)}
height: ${height.toFixed(2)}
resolution: ${resolution.toFixed(2)}

scale: ${scale.toFixed(2)}`;
	}
}
