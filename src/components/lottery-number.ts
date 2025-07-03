import { Container } from "pixi.js";
import { LayoutText } from "../layout";
import { THEME } from "../colors";
import { Button } from "./button";

export class LotteryNumber extends Button {
	constructor(parent: Container, index: number) {
		super(parent);

		this.layout.y.sizing = 40;
		this.layout.x.sizing = 40;

		const text = new LayoutText({ text: index })
		this.addChild(text);
		text.layout.fontSize = 20;
		text.style.fill = THEME.symbol;
	}
}
