import { UI } from "./main";
import { ServerAdaptor } from "./server-adaptors/server-adaptor";

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
			UI.lotteryNumbers[number - 1].toggleSelected(true);
		} else {
			this.selectedNumbers = this.selectedNumbers.filter((num) => num !== number);
			UI.lotteryNumbers[number - 1].toggleSelected(false);
		}
	}
}
