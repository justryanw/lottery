import { Color } from "pixi.js";

class Theme {
	constructor(
		public readonly background = new Color("#121823"),
		public readonly backpane = new Color("#202633"),
		public readonly button = new Color({ h: 217, s: 34, v: 30 }),
		public readonly hover = new Color({ h: 217, s: 34, v: 50 }),
		public readonly symbol = new Color("#ECECED"),
		public readonly select = new Color("#026AA2"),
	) { }
};

const defaultTheme = new Theme();

export const THEME = defaultTheme;
