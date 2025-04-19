import { connectToServer } from '$lib/tcp/connect';
import type { ConnectionProps } from '$lib/tcp/utils';

export class Connection {
	// https://stackoverflow.com/questions/4973622/difference-between-socket-and-websocket
	// https://stackoverflow.com/questions/74457685/how-do-i-use-net-module-node-js-tcp-client-in-html-browser
	readonly socket: Promise<WebSocket>;

	constructor(props: ConnectionProps) {
		this.socket = connectToServer(props);
	}
}
