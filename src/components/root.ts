import { BlurFilter, Container } from "pixi.js";
import { LayoutContainer } from "../layout";
import { arrayFrom } from "../utils";
import { LotteryNumber } from "./lottery-number";
import { Menu } from "./menu/menu";
import { ContainerBackground } from "./container-background";
import { THEME } from "../colors";
import { Caller } from "./caller/caller";

export class Root extends LayoutContainer {
	public mainSection = new LayoutContainer();
	public numberGrid = new LayoutContainer();
	public lotteryNumbers: LotteryNumber[] = [];
	public blurFilter: BlurFilter;

	public caller: Caller;
	public menu: Menu;

	constructor(parent: Container) {
		super();
		parent.addChild(this);

		this.blurFilter = new BlurFilter();
		this.blurFilter.blur = 4;
		this.blurFilter.enabled = false;
		this.filters = [this.blurFilter];

		const callerSection = new LayoutContainer();
		this.addChild(callerSection);
		callerSection.layout.y.sizing = 'grow';
		callerSection.layout.x.sizing = 'grow';
		callerSection.layout.y.childAlignment = 'center';
		callerSection.layout.x.childAlignment = 'center';

		this.caller = new Caller(callerSection);

		this.addChild(this.mainSection);
		this.mainSection.layout.y.sizing = 'grow';
		this.mainSection.layout.x.sizing = 'grow';
		this.mainSection.layout.x.childAlignment = 'center';
		this.mainSection.layout.y.childAlignment = 'center';

		this.mainSection.addChild(this.numberGrid);
		new ContainerBackground(this.numberGrid, THEME.backpane);
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
				const num = new LotteryNumber(row, rowIndex * 6 + columnIndex + 1);
				this.lotteryNumbers.push(num);
			});
		});

		this.menu = new Menu(this);
	}
}
