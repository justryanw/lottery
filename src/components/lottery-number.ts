import { Container } from "pixi.js";
import { LayoutContainer, LayoutText } from "../layout";
import { ContainerBackground } from "./container-background";
import { THEME } from "../colors";

export class LotteryNumber extends LayoutContainer {
	constructor(parent: Container, index: number) {
		super();
		parent.addChild(this);

		new ContainerBackground(this);

		this.layout.y.sizing = 40;
		this.layout.x.sizing = 40;
		this.layout.x.childAlignment = 'center';
		this.layout.y.childAlignment = 'center';

		const text = new LayoutText({ text: index })
		this.addChild(text);
		text.layout.fontSize = 20;
		text.style.fill = THEME.symbol;
	}
}
