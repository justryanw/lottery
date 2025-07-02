import { Container } from "pixi.js";
import { LayoutContainer } from "../layout";
import { arrayFrom } from "../utils";
import { LotteryNumber } from "./lottery-number";

export class Root extends LayoutContainer {
	constructor(parent: Container) {
		super();
		parent.addChild(this);

		const caller = new LayoutContainer();
		this.addChild(caller);
		caller.layout.y.sizing = 100;
		caller.layout.x.sizing = 'grow';
		caller.layout.y.childAlignment = 'center';
		caller.layout.x.childAlignment = 'center';

		const calls = new LayoutContainer();
		caller.addChild(calls);
		calls.layout.y.sizing = 50;
		calls.layout.x.sizing = 300;

		const numberGrid = new LayoutContainer();
		this.addChild(numberGrid);
		numberGrid.layout.y.sizing = 'grow';
		numberGrid.layout.x.sizing = 'grow';
		numberGrid.layout.x.childAlignment = 'center';
		numberGrid.layout.y.childAlignment = 'center';
		numberGrid.layout.childSpacing = 10;
		numberGrid.layout.setPadding(10);

		arrayFrom(10, (rowIndex) => {
			const row = new LayoutContainer();
			numberGrid.addChild(row);
			row.layout.layoutDirection = 'x';
			row.layout.childSpacing = 10;

			arrayFrom(rowIndex === 9 ? 5 : 6, (columnIndex) => {
				new LotteryNumber(row, rowIndex * 6 + columnIndex + 1);
			});
		});

		const menu = new LayoutContainer();
		this.addChild(menu);
		menu.layout.y.sizing = 100;
		menu.layout.x.sizing = 'grow';
	}
}
