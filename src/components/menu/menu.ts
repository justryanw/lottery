import { Container, Texture } from "pixi.js";
import { LayoutContainer, LayoutSprite } from "../../layout";
import { ContainerBackground } from "../container-background";
import { THEME } from "../../colors";
import { Button } from "../button";
import { LuckyDipButton } from "./lucky-dip-button";
import { PlayButton } from "./play-button";

export class Menu extends LayoutContainer {
	public luckyDipButton: LuckyDipButton;
	public playButton: PlayButton;

	constructor(parent: Container) {
		super();
		parent.addChild(this);

		this.layout.y.sizing = 100;
		this.layout.x.sizing = 'grow';
		this.layout.x.childAlignment = 'center';
		this.layout.y.childAlignment = 'center';

		const buttonsRow = new LayoutContainer();
		this.addChild(buttonsRow);
		buttonsRow.layout.layoutDirection = 'x';
		buttonsRow.layout.setPadding(10);
		buttonsRow.layout.childSpacing = 10;
		new ContainerBackground(buttonsRow, THEME.backpane);

		this.luckyDipButton = new LuckyDipButton(buttonsRow);
		this.playButton = new PlayButton(buttonsRow);

		const resetButton = new Button(buttonsRow);
		resetButton.layout.y.sizing = 50;
		resetButton.layout.x.sizing = 50;

		const resetSprite = new LayoutSprite({ texture: Texture.from('arrow-counterclockwise') });
		resetSprite.tint = THEME.symbol;
		resetButton.addChild(resetSprite);
		resetSprite.layout.y.sizing = 20;
		resetSprite.layout.x.sizing = 20;
	}
}
