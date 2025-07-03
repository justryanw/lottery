import { Container } from "pixi.js";
import { LayoutContainer } from "../layout";
import { ContainerBackground } from "./container-background";
import { THEME } from "../colors";

export class Button extends LayoutContainer {
	background: ContainerBackground;

	constructor(parent: Container) {
		super();
		parent.addChild(this);
		this.background = new ContainerBackground(this);
		this.background.strokeColor = THEME.hover;

		this.layout.x.childAlignment = 'center';
		this.layout.y.childAlignment = 'center';

		this.eventMode = 'static';
		this.cursor = 'pointer';

		this.on('pointerover', () => {
			this.background.strokeWidth = 2;
			this.background.draw()
		})

		this.on('pointerout', () => {
			this.background.strokeWidth = 0;
			this.background.draw()
		})

		this.on('pointerdown', () => {
			this.background.color = THEME.background;
			this.background.strokeColor = THEME.button;
			this.background.draw()
		});

		this.on('pointerup', this.pointerUp);
		this.on('pointerupoutside', this.pointerUp);
	}

	pointerUp() {
		this.background.color = THEME.button;
		this.background.strokeColor = THEME.hover;
		this.background.draw()
	}
}
