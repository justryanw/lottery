import { Container, Graphics } from "pixi.js";
import { hasLayoutMixin } from "../layout";
import { THEME } from "../colors";

export class ContainerBackground extends Graphics {
	layoutScale: number = 1;

	constructor(
		parent: Container,
		public color = THEME.button,
		public rounding = 10,
		public strokeWidth = 0,
		public strokeColor = THEME.symbol,
	) {
		super();
		parent.addChild(this);

		if (hasLayoutMixin(this.parent)) this.parent.layout.postLayout = (s) => this.draw(s);
	}

	draw(scale: number = this.layoutScale) {
		if (!hasLayoutMixin(this.parent)) return;
		this.layoutScale = scale;
		this.clear();

		this.roundRect(0, 0, this.parent.layout.x.length, this.parent.layout.y.length, this.rounding * scale)
			.fill({ color: this.color, alpha: 1 });

		if (this.strokeWidth) this.stroke({ width: this.strokeWidth * scale, alignment: 1, color: this.strokeColor });
	}
}
