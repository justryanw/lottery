import { Color, Container, Text } from "pixi.js";
import { hasLayoutMixin, LayoutText } from "../layout";
import { THEME } from "../colors";
import { Button } from "./button";
import { GAME } from "../main";

export class LotteryNumber extends Button {
	protected text: Text;

	constructor(parent: Container, index: number) {
		super(parent);

		this.layout.y.sizing = 40;
		this.layout.x.sizing = 40;
		this.strokeColor = new Color("#026AA2");

		this.text = new LayoutText({ text: index });
		this.addChild(this.text);
		if (!hasLayoutMixin(this.text)) return;
		this.text.layout.fontSize = 20;
		this.text.style.fill = THEME.symbol;

		this.on("pointerdown", () => {
			GAME.toggleNumber(index);
		});
	}

	public toggleSelected(selected: boolean) {
		if (selected) {
			this.strokeHoverColor = new Color("#026AA2");
			this.strokeWidth = 3;
		} else {
			this.strokeHoverColor = THEME.hover;
			this.strokeWidth = 0;
		}
		this.draw();
	}
}
