import { Container } from "pixi.js";
import { LayoutContainer } from "../layout";

export class Menu extends LayoutContainer {
	constructor(parent: Container) {
		super();
		parent.addChild(this);

		this.layout.y.sizing = 100;
		this.layout.x.sizing = 'grow';
	}
}
