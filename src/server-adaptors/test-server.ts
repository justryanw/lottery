import { Result } from "typescript-result";
import { ServerAdaptor, SessionState } from "./server-adaptor";
import { err } from "../utils";

export class TestServer implements ServerAdaptor {
	session: SessionState = {
		gameState: null,
		currentBalance: 0,
	};

	winValues = [0, 0, 0, 50, 100, 200, 500];

	async getSession() {
		return Result.ok(this.session);
	}

	async play(selectedNumbers: number[]) {
		if (this.session.gameState) return err("Cannot start new game while one is in progress.");
		if (selectedNumbers.length !== 6) return err("6 numbers must be selected.");
		this.startGame(selectedNumbers);
		await new Promise(resolve => setTimeout(resolve, 1000));

		if (!this.session.gameState) return err("Error creating game state.");
		return Result.ok(this.session.gameState);
	}

	async reset() {
		this.session = {
			gameState: null,
			currentBalance: 0,
		};

		return Result.ok();
	}

	async advanceStage() {
		if (!this.session.gameState) return err("Cannot advance game stage while no game is in progress.");

		this.session.gameState.currentStage++;

		if (this.session.gameState.currentStage >= 5) {
			this.session.currentBalance += this.session.gameState.winAmount;
			this.session.gameState = null;
		}

		return Result.ok();
	}

	startGame(selectedNumbers: number[]) {
		const calledNumbers = [2, 4, 8, 10, 32, 42];

		const matchingCount = selectedNumbers.filter(num => calledNumbers.includes(num)).length;

		this.session.gameState = {
			selectedNumbers,
			calledNumbers,
			winAmount: this.winValues[matchingCount],
			currentStage: 0,
		};
	}
}
