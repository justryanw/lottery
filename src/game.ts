import { Result } from "typescript-result";
import { NUMBERS, REDRAW, UI } from "./main";
import { ServerAdaptor, SessionState } from "./server-adaptors/server-adaptor";
import { selectUniqueRandomFromArray } from "./utils";

export class Game {
	selectedNumbers: number[] = [];

	constructor(
		protected readonly server: ServerAdaptor,
		protected session: SessionState,
	) { }

	public async play() {
		await Result.fromAsync(this.server.play(this.selectedNumbers))
			.onFailure((error) => console.log(error))
			.onSuccess((gameState) => {
				this.session.gameState = gameState;
				this.session.gameState.calledNumbers.forEach((num, i) => UI.caller.calls[i].text.text = num);
				REDRAW();
				console.log("Succesfully started game");
			})
			.map(() => this.server.advanceStage())
			.map(() => this.server.advanceStage())
			.map(() => this.server.advanceStage())
			.map(() => this.server.advanceStage())
			.map(() => this.server.advanceStage())
			.onFailure((error) => console.log(error))
			.onSuccess(() => {
				console.log("Succesfully ended game");
			})
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
	}

	updateUiButtons() {
		NUMBERS.forEach((num) => {
			const i = num - 1;
			UI.lotteryNumbers[i].toggleSelected(this.selectedNumbers.includes(num));
		});
	}
}
