import { Err, Ok, Result } from "./utils";

interface SessionState {
	gameState: GameState | null;
	currentBalance: number;
}

interface GameState {
	selectedNumbers: number[];
	calledNumbers: number[];
	winAmount: number;
	currentStage: number;
}

interface Server {
	getSession(): Result<SessionState>,
	play(selectedNumbers: number[]): Result<GameState>,
	reset(): Result,
	advanceStage(): Result,
}

export class TestServer implements Server {
	session: SessionState = {
		gameState: null,
		currentBalance: 0,
	};

	winValues = [50, 100, 200, 500];

	getSession(): Result<SessionState> {
		return Ok(this.session);
	}

	play(selectedNumbers: number[]): Result<GameState> {
		if (this.session.gameState !== null)
			return Err(new Error("Cannot start new game while one is in progress."));

		this.startGame(selectedNumbers);

		if (this.session.gameState === null)
			return Err(new Error("Error creating game state."));

		return Ok(this.session.gameState);
	}

	reset(): Result<void> {
		return Err(new Error("Method not implemented."));
	}

	advanceStage(): Result<void> {
		if (this.session.gameState === null)
			return Err(new Error("Cannot advance game stage while no game is in progress."));

		this.session.gameState.currentStage++;
		return Ok();
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
