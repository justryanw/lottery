import { Color, Container, Graphics } from "pixi.js";
import { hasLayoutMixin } from "../layout";

export class ContainerBackground extends Graphics {
	constructor(
		parent: Container,
		protected color = new Color('white'),
		protected strokeColor = new Color('gray'),
		protected rounding = 0,
		protected strokeWidth = 0,
	) {
		super();
		parent.addChild(this);

		if (hasLayoutMixin(this.parent)) this.parent.layout.postLayout = (s) => this.draw(s);
	}

	draw(scale: number) {
		if (!hasLayoutMixin(this.parent)) return;
		this.clear();

		this.roundRect(0, 0, this.parent.layout.x.length, this.parent.layout.y.length, this.rounding * scale)
			.fill({ color: this.color, alpha: 1 })
			.stroke({ width: this.strokeWidth * scale, alignment: 1, color: this.strokeColor });
	}
}
