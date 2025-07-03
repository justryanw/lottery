import { Color, Container } from "pixi.js";
import { LayoutContainer, LayoutText } from "../layout";
import { ContainerBackground } from "./container-background";

export class LotteryNumber extends LayoutContainer {
	constructor(parent: Container, index: number) {
		super();
		parent.addChild(this);

		const color = new Color({ h: 40, s: 60, v: 100 });
		const strokeColor = new Color({ h: 40, s: 50, v: 50 });

		new ContainerBackground(this, color, strokeColor, 10, 3);

		this.layout.y.sizing = 40;
		this.layout.x.sizing = 40;
		this.layout.x.childAlignment = 'center';
		this.layout.y.childAlignment = 'center';

		const text = new LayoutText({ text: index })
		this.addChild(text);
		text.layout.fontSize = 20;
	}
}
