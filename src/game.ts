import { ServerAdaptor } from "./server-adaptors/server-adaptor";

export class Game {
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
}
