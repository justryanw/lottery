import { Color, Container, Graphics } from "pixi.js";
import { LayoutContainer, LayoutText } from "../layout";

export class LotteryNumber extends LayoutContainer {
	private graphics = new Graphics();

	constructor(parent: Container, index: number) {
		super();
		parent.addChild(this);
		this.addChild(this.graphics);

		this.layout.y.sizing = 40;
		this.layout.x.sizing = 40;
		this.layout.x.childAlignment = 'center';
		this.layout.y.childAlignment = 'center';
		this.layout.postLayout = (s) => this.draw(s);

		const text = new LayoutText({ text: index })
		this.addChild(text);
		text.style.trim = true;
		text.layout.fontSize = 20;
	}

	draw(scale: number) {
		this.graphics.clear();

		const color = new Color().setValue({ h: 40, s: 60, v: 100 });
		const strokeColor = new Color().setValue({ h: 40, s: 50, v: 50 });

		this.graphics.roundRect(0, 0, this.layout.x.length, this.layout.y.length, 10 * scale)
			.fill({ color, alpha: 1 })
			.stroke({ width: 3 * scale, alignment: 1, color: strokeColor });
	}
}
