import { Color, Container } from "pixi.js";
import { LayoutContainer } from "../layout";
import { ContainerBackground } from "./container-background";
import { THEME } from "../colors";
import { sound } from "@pixi/sound";

export type ButtonState = 'up' | 'hover' | 'down';

export class Button extends LayoutContainer {
	background: ContainerBackground;
	state: ButtonState = 'up';

	pressed: boolean = false;
	hovered: boolean = false;

	public color: Color = THEME.button;
	public strokeColor: Color = THEME.button;
	public strokeWidth = 0;

	public hoverColor: Color = THEME.button;
	public strokeHoverColor: Color = THEME.hover;
	public strokeHoverWidth = 2;

	public pressColor: Color = THEME.backpane;
	public strokePressColor: Color = THEME.hover;
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

		this.on('pointerover', () => this.setHovered(true));
		this.on('pointerout', () => this.setHovered(false));

		this.on('pointerdown', () => this.setPressed(true));
		this.on('pointerup', () => this.setPressed(false));
		this.on('pointerupoutside', () => this.setPressed(false));
	}

	setHovered(hovered: boolean) {
		this.hovered = hovered;
		if (!this.pressed) this.setState(hovered ? 'hover' : 'up');
	}

	setPressed(pressed: boolean) {
		this.pressed = pressed;
		this.setState(pressed ? 'down' : this.hovered ? 'hover' : 'up');
		if (pressed) sound.play('glass-002', { volume: 0.15, speed: 1 + (Math.random() - 0.5) * 0.2 });
	}

	setState(state: ButtonState) {
		this.state = state;
		this.draw();
	}

	public draw() {
		switch (this.state) {
			case 'up':
				this.background.color = this.color;
				this.background.strokeColor = this.strokeColor;
				this.background.strokeWidth = this.strokeWidth;
				break;
			case 'hover':
				this.background.color = this.hoverColor;
				this.background.strokeColor = this.strokeHoverColor;
				this.background.strokeWidth = this.strokeHoverWidth;
				break;
			case 'down':
				this.background.color = this.pressColor;
				this.background.strokeColor = this.strokePressColor;
				this.background.strokeWidth = this.strokePressWidth;
				break;
		}
		this.background.draw();
	}
}
