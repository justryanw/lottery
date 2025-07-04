import { Color, Container } from "pixi.js";
import { LayoutContainer, LayoutText, TextWithLayout } from "../layout";
import { ContainerBackground } from "./container-background";
import { THEME } from "../colors";
import { Button } from "./button";
import { formatCurrency } from "../utils";
import { REDRAW, UI } from "../main";

export class WinModal extends LayoutContainer {
	closeButton: Button;
	winText: TextWithLayout;

	constructor(parent: Container) {
		super();
		parent.addChild(this);
		this.layout.x.childAlignment = this.layout.y.childAlignment = 'center';
		this.visible = false;

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

		this.closeButton = new Button(closeButtonRow);
		this.closeButton.layout.x.sizing = this.closeButton.layout.y.sizing = 20;

		const closeButtonText = new LayoutText({ text: "x" })
		closeButtonText.style.fill = THEME.symbol;
		this.closeButton.addChild(closeButtonText);

		const textContainer = new LayoutContainer();
		modal.addChild(textContainer);
		textContainer.layout.setPadding(15);
		textContainer.layout.childSpacing = 10;
		textContainer.layout.x.childAlignment = 'center';

		const congratsText = new LayoutText({ text: "Congratulations!" })
		congratsText.style.fill = THEME.symbol;
		congratsText.layout.fontSize = 28;
		textContainer.addChild(congratsText);

		this.winText = new LayoutText({ text: "You have won: £5.00" })
		this.winText.style.fill = THEME.symbol;
		this.winText.layout.fontSize = 20;
		textContainer.addChild(this.winText);
	}

	public async show(winAmount: number) {
		this.winText.text = `You have won ${formatCurrency(winAmount)}`;
		this.visible = true;
		UI.blurFilter.enabled = true;
		REDRAW();

		return new Promise<void>((resolve) => {
			const onClick = () => {
				this.closeButton.removeListener('pointerdown', onClick)
				this.visible = false;
				UI.blurFilter.enabled = false;
				resolve();
			}

			this.closeButton.on('pointerdown', onClick);
		});
	}
}
