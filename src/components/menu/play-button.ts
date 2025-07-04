import { Container } from "pixi.js";
import { Button } from "../button";
import { LayoutText } from "../../layout";
import { THEME } from "../../colors";
import { GAME } from "../../main";

export class PlayButton extends Button {
	constructor(parent: Container) {
		super(parent);
		this.setActive(false);

		this.layout.y.sizing = 50;
		this.layout.x.sizing = 100;

		const playButtonText = new LayoutText({ text: "Play" });
		this.addChild(playButtonText);
		playButtonText.layout.fontSize = 24;
		playButtonText.style.fill = THEME.symbol;

		this.on("pointerup", async () => await GAME.play());
	}
}
