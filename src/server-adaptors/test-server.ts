import { Result } from "typescript-result";
import { ServerAdaptor, SessionState } from "./server-adaptor";
import { err, selectUniqueRandomFromArray } from "../utils";
import { NUMBERS } from "../main";

const FAKELATENCY = false;
const LATENCY = 50;
const JITTER = 20;

async function fakeLatency() {
	if (FAKELATENCY) {
		await new Promise(resolve => setTimeout(resolve, LATENCY + (JITTER / 2 - JITTER * Math.random())));
	}
}

export class TestServer implements ServerAdaptor {
	session: SessionState = {
		gameState: null,
		currentBalance: 0,
	};

	winValues = [0, 0, 0, 50, 100, 200, 500];

	async getSession() {
		await fakeLatency();

		return Result.ok(this.session);
	}

	async play(selectedNumbers: number[]) {
		await fakeLatency();

		if (this.session.gameState) return err("Cannot start new game while one is in progress.");
		if (selectedNumbers.length !== 6) return err("6 numbers must be selected.");
		this.startGame(selectedNumbers);

		if (!this.session.gameState) return err("Error creating game state.");
		return Result.ok(this.session.gameState);
	}

	async reset() {
		await fakeLatency();

		this.session = {
			gameState: null,
			currentBalance: 0,
		};

		return Result.ok();
	}

	async advanceStage() {
		await fakeLatency();

		if (!this.session.gameState) return err("Cannot advance game stage while no game is in progress.");

		this.session.gameState.currentStage++;

		if (this.session.gameState.currentStage >= 5) {
			this.session.currentBalance += this.session.gameState.winAmount;
			this.session.gameState = null;
		}

		return Result.ok();
	}

	startGame(selectedNumbers: number[]) {
		const calledNumbers = selectUniqueRandomFromArray(NUMBERS, 6);
		// const calledNumbers = [1, 2, 3, 4, 5, 6];

		const matchingCount = selectedNumbers.filter(num => calledNumbers.includes(num)).length;
		console.log(matchingCount);

		this.session.gameState = {
			selectedNumbers,
			calledNumbers,
			winAmount: this.winValues[matchingCount],
			currentStage: 0,
		};
	}
}
