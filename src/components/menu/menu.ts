import { Container, Texture } from "pixi.js";
import { LayoutContainer, LayoutSprite, LayoutText, TextWithLayout } from "../../layout";
import { ContainerBackground } from "../container-background";
import { THEME } from "../../colors";
import { Button } from "../button";
import { LuckyDipButton } from "./lucky-dip-button";
import { PlayButton } from "./play-button";

export class Menu extends LayoutContainer {
	public luckyDipButton: LuckyDipButton;
	public playButton: PlayButton;
	public balanceText: TextWithLayout;

	constructor(parent: Container) {
		super();
		parent.addChild(this);

		this.layout.y.sizing = 'grow';
		this.layout.x.sizing = 'grow';
		this.layout.x.childAlignment = 'center';
		this.layout.y.childAlignment = 'center';
		this.layout.setPadding(10);

		const vert = new LayoutContainer();
		this.addChild(vert);
		new ContainerBackground(vert, THEME.backpane);
		vert.layout.x.childAlignment = 'center';
		vert.layout.y.childAlignment = 'center';
		vert.layout.layoutDirection = 'y';
		vert.layout.y.paddingEnd = 10;
		vert.layout.childSpacing = 10;

		const infoContainer = new LayoutContainer();
		vert.addChild(infoContainer);
		infoContainer.layout.x.childAlignment = 'center';
		infoContainer.layout.y.childAlignment = 'center';
		infoContainer.layout.x.sizing = infoContainer.layout.y.sizing = 'grow';

		const info = new LayoutContainer();
		infoContainer.addChild(info);
		new ContainerBackground(info, THEME.button);
		info.layout.x.sizing = 'grow'
		info.layout.y.sizing = 30;
		info.layout.y.childAlignment = 'center';
		info.layout.x.childAlignment = 'center';

		this.balanceText = new LayoutText();
		info.addChild(this.balanceText);
		this.balanceText.style.fill = THEME.symbol;
		this.balanceText.layout.fontSize = 16;

		const buttonsRow = new LayoutContainer();
		vert.addChild(buttonsRow);
		buttonsRow.layout.x.setPadding(10);
		buttonsRow.layout.layoutDirection = 'x';
		buttonsRow.layout.childSpacing = 10;

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
