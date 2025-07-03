import { Result } from "typescript-result";
import { err } from "./utils";

export interface SessionState {
	gameState: GameState | null;
	currentBalance: number;
}

export interface GameState {
	selectedNumbers: number[];
	calledNumbers: number[];
	winAmount: number;
	currentStage: number;
}

export interface Server {
	getSession(): Result<SessionState, Error>,
	play(selectedNumbers: number[]): Result<GameState, Error>,
	reset(): Result<void, Error>,
	advanceStage(): Result<void, Error>,
}

export class TestServer implements Server {
	session: SessionState = {
		gameState: null,
		currentBalance: 0,
	};

	winValues = [50, 100, 200, 500];

	getSession() {
		return Result.ok(this.session);
	}

	play(selectedNumbers: number[]) {
		if (this.session.gameState) return err("Cannot start new game while one is in progress.");
		if (selectedNumbers.length !== 6) return err("6 numbers must be selected.");
		this.startGame(selectedNumbers);

		if (!this.session.gameState) return err("Error creating game state.");
		return Result.ok(this.session.gameState);
	}

	reset() {
		this.session = {
			gameState: null,
			currentBalance: 0,
		};

		return Result.ok();
	}

	advanceStage() {
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
