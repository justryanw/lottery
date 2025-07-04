import { Container, Texture } from "pixi.js";
import { Button } from "../button";
import { LayoutSprite } from "../../layout";
import { THEME } from "../../colors";
import { GAME } from "../../main";

export class LuckyDipButton extends Button {
	constructor(parent: Container) {
		super(parent);
		this.layout.y.sizing = 50;
		this.layout.x.sizing = 50;

		const diceSprite = new LayoutSprite({ texture: Texture.from('dice') });
		diceSprite.tint = THEME.symbol;
		this.addChild(diceSprite);
		diceSprite.layout.y.sizing = 20;
		diceSprite.layout.x.sizing = 20;

		this.on('pointerdown', () => {
			GAME.luckyDip();
		});
	}
}
