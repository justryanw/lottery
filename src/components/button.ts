import { Color, Container } from "pixi.js";
import { LayoutContainer } from "../layout";
import { ContainerBackground } from "./container-background";
import { THEME } from "../colors";
import { sound } from "@pixi/sound";

export class Button extends LayoutContainer {
	background: ContainerBackground;

	public color: Color = THEME.button;
	public hoverColor: Color = THEME.button;
	public pressColor: Color = THEME.backpane;

	public strokeColor: Color = THEME.button;
	public strokeHoverColor: Color = THEME.hover;
	public strokePressColor: Color = THEME.hover;

	public strokeWidth = 0;
	public strokeHoverWidth = 2;
	public strokePressWidth = 2;

	constructor(
		parent: Container,
	) {
		super();
		parent.addChild(this);
		this.background = new ContainerBackground(this);
		this.background.strokeColor = THEME.hover;

		this.layout.x.childAlignment = 'center';
		this.layout.y.childAlignment = 'center';

		this.eventMode = 'static';
		this.cursor = 'pointer';

		this.on('pointerover', () => {
			this.background.color = this.hoverColor;
			this.background.strokeColor = this.strokeHoverColor;
			this.background.strokeWidth = this.strokeHoverWidth;
			this.background.draw()
		})

		this.on('pointerout', () => {
			this.background.color = this.color;
			this.background.strokeColor = this.strokeColor;
			this.background.strokeWidth = this.strokeWidth;
			this.background.draw()
		})

		this.on('pointerdown', () => {
			this.background.color = this.pressColor;
			this.background.strokeColor = this.strokePressColor;
			this.background.strokeWidth = this.strokePressWidth;
			this.background.draw()

			sound.play('glass-002', { volume: 0.15, speed: 1 + (Math.random() - 0.5) * 0.2 });
		});

		this.on('pointerup', this.pointerUp);
		this.on('pointerupoutside', this.pointerUp);
	}

	pointerUp() {
		this.background.color = this.color;
		this.background.strokeColor = this.strokeColor;
		this.background.strokeWidth = this.strokeWidth;
		this.background.draw()
	}
}
