import { NUMBERS, UI } from "./main";
import { ServerAdaptor } from "./server-adaptors/server-adaptor";
import { selectUniqueRandomFromArray } from "./utils";

export class Game {
	selectedNumbers: number[] = [];

	constructor(
		protected readonly server: ServerAdaptor,
	) { }

	public async play() {
		console.log(await this.server.play([5, 6, 7, 8, 9, 10]))
		console.log(await this.server.advanceStage())
		console.log(await this.server.advanceStage())
		console.log(await this.server.advanceStage())
		console.log(await this.server.advanceStage())
		console.log(await this.server.advanceStage())
		console.log((await this.server.getSession()).value)
	}

	public toggleNumber(number: number) {
		if (!this.selectedNumbers.includes(number) && this.selectedNumbers.length < 6) {
			this.selectedNumbers.push(number);
		} else {
			this.selectedNumbers = this.selectedNumbers.filter((num) => num !== number);
		}
		this.updateUiButtons();
	}

	public luckyDip() {
		this.selectedNumbers = selectUniqueRandomFromArray(NUMBERS, 6);
		this.updateUiButtons();
		console.log(this.selectedNumbers);
	}

	updateUiButtons() {
		NUMBERS.forEach((num) => {
			const i = num - 1;
			UI.lotteryNumbers[i].toggleSelected(this.selectedNumbers.includes(num));
		});
	}
}
