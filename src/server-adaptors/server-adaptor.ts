import { Result } from "typescript-result";

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

export interface ServerAdaptor {
	getSession(): Promise<Result<SessionState, Error>>,
	play(selectedNumbers: number[]): Promise<Result<GameState, Error>>,
	reset(): Promise<Result<void, Error>>,
	advanceStage(): Promise<Result<void, Error>>,
}
