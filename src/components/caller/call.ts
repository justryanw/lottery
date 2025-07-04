
import { Container } from "pixi.js";
import { LayoutContainer, LayoutText, TextWithLayout } from "../../layout";
import { THEME } from "../../colors";
import { ContainerBackground } from "../container-background";

export class Call extends LayoutContainer {
	text: TextWithLayout;
	background: ContainerBackground;

	constructor(parent: Container) {
		super();
		parent.addChild(this);
		this.background = new ContainerBackground(this, THEME.button);
		this.layout.x.sizing = this.layout.y.sizing = 40;
		this.layout.x.childAlignment = this.layout.y.childAlignment = 'center';

		this.text = new LayoutText();
		this.addChild(this.text);
		this.text.layout.fontSize = 20;
		this.text.style.fill = THEME.symbol;
	}
}
