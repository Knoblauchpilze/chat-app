import { connectToServer } from '$lib/tcp/connect';
import type { ConnectionProps } from '$lib/tcp/utils';

const STATUS_CHECK_INTERVAL_MS = 1000;
const RECONNECT_INTERVAL_MS = 2000;

export class Connection {
	// https://stackoverflow.com/questions/4973622/difference-between-socket-and-websocket
	// https://stackoverflow.com/questions/74457685/how-do-i-use-net-module-node-js-tcp-client-in-html-browser
	// TODO: Maybe leave the socket undefined and have a socketPromise internally
	// This would make the UI cleaner by having just a if undefined and no await
	socket: Promise<WebSocket | undefined> | undefined = undefined;
	errorMessage: string | undefined = undefined;

	private readonly props: ConnectionProps;
	private timeoutId: NodeJS.Timeout | undefined = undefined;

	constructor(props: ConnectionProps) {
		this.props = props;
		this.socket = this.createConnectionAttempt();
	}

	private async createConnectionAttempt(): Promise<WebSocket | undefined> {
		console.log('creating connection attempt');
		// https://stackoverflow.com/questions/42013104/placement-of-catch-before-and-after-then
		return connectToServer(this.props).then(
			(socket) => this.handleConnectionSucceeded(socket),
			// TODO: Should handle the failure reason
			() => this.handleConnectionFailed()
		);
	}

	private handleConnectionSucceeded(socket: WebSocket): WebSocket {
		console.log('connection succeeded');
		this.registerConnectionStatusCheck();
		return socket;
	}

	private registerConnectionStatusCheck() {
		console.log('registering connection status check');
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(() => this.checkConnectionStatus(), STATUS_CHECK_INTERVAL_MS);
	}

	private checkConnectionStatus() {
		console.log('checking connection status');

		this.registerConnectionStatusCheck();
	}

	private handleConnectionFailed(): undefined {
		console.log('connection failed');
		this.errorMessage = this.analyzeFailureReason();
		this.registerConnectionAttempt();
		return undefined;
	}

	private registerConnectionAttempt() {
		console.log('registering connection attempt');
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(() => {
			this.socket = this.createConnectionAttempt();
		}, RECONNECT_INTERVAL_MS);
	}

	private analyzeFailureReason(): string {
		return 'Unexpected connection error';
	}
}
