import { Result } from "typescript-result";
import { NUMBERS, REDRAW, UI, WINMODAL } from "./main";
import { ServerAdaptor, SessionState } from "./server-adaptors/server-adaptor";
import { formatCurrency, selectUniqueRandomFromArray } from "./utils";
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
			.onSuccess(() => this.gameLoop())
			.onSuccess(({ winAmount, calledNumbers, selectedNumbers }) => {
				this.setCaller(calledNumbers, selectedNumbers);
				if (winAmount > 0) return WINMODAL.show(winAmount)
			})
			.map(() => this.server.getSession())
			.fold(
				(session) => this.session = session,
				(error) => console.error(error),
			);

		this.setGameInProgres(false);
		this.setBalanceText(this.session);
	}

	async gameLoop() {
		for (let i = 0; i < 5; i++) {
			await this.server.advanceStage();
		}
	}

	setBalanceText(session: SessionState) {
		UI.menu.balanceText.text = `Balance: ${formatCurrency(session.currentBalance)}`;
		REDRAW();
	}

	setGameInProgres(inProgress: boolean) {
		UI.menu.playButton.setActive(!inProgress);
		UI.menu.luckyDipButton.setActive(!inProgress);
		UI.menu.resetButton.setActive(!inProgress);
		UI.lotteryNumbers.forEach((num) => num.setActive(!inProgress));
	}

	public setCaller(calledNumbers: number[], selectedNumbers: number[]) {
		calledNumbers.forEach((num, i) => {
			const call = UI.caller.calls[i];
			call.text.text = num;
			call.background.color = selectedNumbers.includes(num) ? THEME.select : THEME.button;
		});
		REDRAW();
	}

	public clearCaller() {
		UI.caller.calls.forEach((call) => {
			call.text.text = "";
			call.background.color = THEME.button;
		});
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

	public async reset() {
		await Result.fromAsync(this.server.reset())
			.map(() => this.server.getSession())
			.fold(
				(session) => this.session = session,
				(error) => console.error(error),
			);

		this.selectedNumbers = [];
		this.clearCaller();
		this.setGameInProgres(false);
		this.setBalanceText(this.session);
		this.updateUiButtons();
	}

	updateUiButtons() {
		NUMBERS.forEach((num) => {
			const i = num - 1;
			UI.lotteryNumbers[i].toggleSelected(this.selectedNumbers.includes(num));
		});
		if (this.selectedNumbers.length === 6) {
			UI.menu.playButton.setActive(true);
		} else {
			UI.menu.playButton.setActive(false);

		}
	}
}
