import { Container } from "pixi.js";
import { LayoutContainer } from "../layout";
import { arrayFrom } from "../utils";
import { LotteryNumber } from "./lottery-number";
import { Menu } from "./menu";

export class Root extends LayoutContainer {
	caller = new LayoutContainer();
	numberGrid = new LayoutContainer();
	menu: Menu;

	constructor(parent: Container) {
		super();
		parent.addChild(this);

		this.addChild(this.caller);
		this.caller.layout.y.sizing = 100;
		this.caller.layout.x.sizing = 'grow';
		this.caller.layout.y.childAlignment = 'center';
		this.caller.layout.x.childAlignment = 'center';

		const calls = new LayoutContainer();
		this.caller.addChild(calls);
		calls.layout.y.sizing = 50;
		calls.layout.x.sizing = 300;

		this.addChild(this.numberGrid);
		this.numberGrid.layout.y.sizing = 'grow';
		this.numberGrid.layout.x.sizing = 'grow';
		this.numberGrid.layout.x.childAlignment = 'center';
		this.numberGrid.layout.y.childAlignment = 'center';
		this.numberGrid.layout.childSpacing = 10;
		this.numberGrid.layout.setPadding(10);

		arrayFrom(10, (rowIndex) => {
			const row = new LayoutContainer();
			this.numberGrid.addChild(row);
			row.layout.layoutDirection = 'x';
			row.layout.childSpacing = 10;

			arrayFrom(rowIndex === 9 ? 5 : 6, (columnIndex) => {
				new LotteryNumber(row, rowIndex * 6 + columnIndex + 1);
			});
		});

		this.menu = new Menu(this);
	}
}
