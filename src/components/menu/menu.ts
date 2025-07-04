import { Container, Texture } from "pixi.js";
import { LayoutContainer, LayoutSprite, LayoutText } from "../../layout";
import { ContainerBackground } from "../container-background";
import { THEME } from "../../colors";
import { Button } from "../button";
import { LuckyDip as LuckyDipButton } from "./lucky-dip-button";

export class Menu extends LayoutContainer {
	public luckyDipButton: LuckyDipButton;

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

		const playButton = new Button(buttonsRow);
		playButton.layout.y.sizing = 50;
		playButton.layout.x.sizing = 100;

		const playButtonText = new LayoutText({ text: "Play" });
		playButton.addChild(playButtonText);
		playButtonText.layout.fontSize = 24;
		playButtonText.style.fill = THEME.symbol;

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
