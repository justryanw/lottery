import { Result } from "typescript-result";
import { NUMBERS, REDRAW, UI } from "./main";
import { GameState, ServerAdaptor, SessionState } from "./server-adaptors/server-adaptor";
import { selectUniqueRandomFromArray } from "./utils";
import { THEME } from "./colors";

export class Game {
	selectedNumbers: number[] = [];

	constructor(
		protected readonly server: ServerAdaptor,
		protected session: SessionState,
	) {
		this.setBalanceText(session);
	}

	public async play() {
		this.setGameInProgres(true);
		await Result.fromAsync(this.server.play(this.selectedNumbers))
			.onSuccess((gameState) => {
				this.session.gameState = gameState;
				this.setCaller(gameState);
			})
			.map(() => this.server.advanceStage())
			.map(() => this.server.advanceStage())
			.map(() => this.server.advanceStage())
			.map(() => this.server.advanceStage())
			.map(() => this.server.advanceStage())
			.map(() => this.server.getSession())
			.onSuccess((session) => {
				this.session = session;
				this.setBalanceText(session);
			})
			.onFailure((error) => console.log(error))

		this.setGameInProgres(false);
		this.setBalanceText(this.session);
	}

	setBalanceText(session: SessionState) {
		const formattedCurrency = session.currentBalance.toLocaleString('en-GB', {
			style: 'currency',
			currency: 'GBP',
		});

		UI.menu.balanceText.text = `Balance: ${formattedCurrency}`;
		REDRAW();
	}

	setGameInProgres(inProgress: boolean) {
		UI.menu.playButton.setActive(!inProgress);
		UI.menu.luckyDipButton.setActive(!inProgress);
		UI.lotteryNumbers.forEach((num) => num.setActive(!inProgress));
	}

	public setCaller(gameState: GameState) {
		gameState.calledNumbers.forEach((num, i) => {
			const call = UI.caller.calls[i];
			call.text.text = num;
			call.background.color = gameState.selectedNumbers.includes(num) ? THEME.select : THEME.button;
		});
		REDRAW();
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
