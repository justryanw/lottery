import { Server } from "./server";

export class Game {
	constructor(
		protected readonly server: Server,
	) {
		console.log(server.play([5, 6, 7, 8, 9, 10]))
		console.log(server.advanceStage())
		console.log(server.advanceStage())
		console.log(server.advanceStage())
		console.log(server.advanceStage())
		console.log(server.advanceStage())
		console.log(server.getSession().value)
	}
}
