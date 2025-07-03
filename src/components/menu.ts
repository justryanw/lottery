import { Container } from "pixi.js";
import { LayoutContainer, LayoutText } from "../layout";
import { ContainerBackground } from "./container-background";

export class Menu extends LayoutContainer {
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
		new ContainerBackground(buttonsRow);

		const luckyDipButton = new LayoutContainer();
		buttonsRow.addChild(luckyDipButton);
		luckyDipButton.layout.y.sizing = 50;
		luckyDipButton.layout.x.sizing = 50;
		new ContainerBackground(luckyDipButton);

		const playButton = new LayoutContainer();
		buttonsRow.addChild(playButton);
		playButton.layout.y.sizing = 50;
		playButton.layout.x.sizing = 100;
		playButton.layout.x.childAlignment = 'center';
		playButton.layout.y.childAlignment = 'center';
		new ContainerBackground(playButton);

		const playButtonText = new LayoutText({ text: "Play" });
		playButton.addChild(playButtonText);
		playButtonText.layout.fontSize = 24;

		const resetButton = new LayoutContainer();
		buttonsRow.addChild(resetButton);
		resetButton.layout.y.sizing = 50;
		resetButton.layout.x.sizing = 50;
		new ContainerBackground(resetButton);
	}
}
