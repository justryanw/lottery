import { Container } from "pixi.js";
import { LayoutContainer } from "../../layout";
import { THEME } from "../../colors";
import { ContainerBackground } from "../container-background";
import { arrayFrom } from "../../utils";
import { Call } from "./call";

export class Caller extends LayoutContainer {
	calls: Call[];

	constructor(parent: Container) {
		super();
		parent.addChild(this);
		new ContainerBackground(this, THEME.backpane);
		this.layout.layoutDirection = 'x';
		this.layout.setPadding(10);
		this.layout.childSpacing = 10;

		this.calls = arrayFrom(6, () => new Call(this));
	}
}
