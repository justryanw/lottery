import { Container, Texture } from "pixi.js";
import { THEME } from "../../colors";
import { LayoutSprite } from "../../layout";
import { Button } from "../button";
import { GAME } from "../../main";

export class ResetButton extends Button {
	constructor(parent: Container) {
		super(parent);
		this.layout.y.sizing = 50;
		this.layout.x.sizing = 50;

		const resetSprite = new LayoutSprite({ texture: Texture.from('arrow-counterclockwise') });
		this.addChild(resetSprite);
		resetSprite.tint = THEME.symbol;
		resetSprite.layout.y.sizing = 20;
		resetSprite.layout.x.sizing = 20;

		this.on('pointerdown', async () => await GAME.reset());
	}
}
