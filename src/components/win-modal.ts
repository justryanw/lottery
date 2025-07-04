import { Color, Container } from "pixi.js";
import { LayoutContainer, LayoutText } from "../layout";
import { ContainerBackground } from "./container-background";
import { THEME } from "../colors";
import { Button } from "./button";

export class WinModal extends LayoutContainer {
	constructor(parent: Container) {
		super();
		parent.addChild(this);
		this.layout.x.childAlignment = this.layout.y.childAlignment = 'center';

		const fade = new ContainerBackground(this, new Color('black'), 0);
		fade.alpha = 0.3;

		const modal = new LayoutContainer();
		this.addChild(modal);
		new ContainerBackground(modal);
		modal.layout.x.childAlignment = modal.layout.y.childAlignment = 'center';
		modal.layout.setPadding(10);

		const closeButtonRow = new LayoutContainer();
		modal.addChild(closeButtonRow);
		closeButtonRow.layout.x.sizing = 'grow';
		closeButtonRow.layout.x.childAlignment = 'end';

		const closeButton = new Button(closeButtonRow);
		closeButton.layout.x.sizing = closeButton.layout.y.sizing = 20;

		const closeButtonText = new LayoutText({ text: "x" })
		closeButtonText.style.fill = THEME.symbol;
		closeButton.addChild(closeButtonText);

		const textContainer = new LayoutContainer();
		modal.addChild(textContainer);
		textContainer.layout.setPadding(15);
		textContainer.layout.childSpacing = 10;
		textContainer.layout.x.childAlignment = 'center';

		const congratsText = new LayoutText({ text: "Congratulations!" })
		congratsText.style.fill = THEME.symbol;
		congratsText.layout.fontSize = 28;
		textContainer.addChild(congratsText);

		const winText = new LayoutText({ text: "You have won: £5.00" })
		winText.style.fill = THEME.symbol;
		winText.layout.fontSize = 20;
		textContainer.addChild(winText);
	}
}
