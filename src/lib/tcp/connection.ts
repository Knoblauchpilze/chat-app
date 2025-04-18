import { PUBLIC_TCP_API_HOST, PUBLIC_TCP_API_PORT } from '$env/static/public';
import { parse as uuidParse } from 'uuid';

export interface SocketProps {
	host?: string;
	port?: number;
	clientId: string;
}

const DEFAULT_CONNECT_TIMEOUT_MS = 5000;

export function connectToServer(props: SocketProps): Promise<WebSocket> {
	return new Promise((resolve, reject) => {
		const host = props.host ?? PUBLIC_TCP_API_HOST;
		const port = props.port ?? PUBLIC_TCP_API_PORT;

		// https://stackoverflow.com/questions/4973622/difference-between-socket-and-websocket
		// https://stackoverflow.com/questions/74457685/how-do-i-use-net-module-node-js-tcp-client-in-html-browser
		const wsUrl = `ws://${host}:${port}/chats/ws`;

		const socket = new WebSocket(wsUrl);

		const timeoutId = setTimeout(() => {
			socket.close();
			reject(new Error(`Connection timeout after ${DEFAULT_CONNECT_TIMEOUT_MS}ms`));
		}, DEFAULT_CONNECT_TIMEOUT_MS);

		socket.addEventListener('open', () => {
			clearTimeout(timeoutId);

			// https://www.npmjs.com/package/uuid#uuidparsestr
			const dataToSend = uuidParse(props.clientId);

			socket.send(dataToSend);

			resolve(socket);
		});

		socket.addEventListener('error', () => {
			clearTimeout(timeoutId);
			reject(new Error('WebSocket connection error'));
		});

		socket.addEventListener('close', (event) => {
			clearTimeout(timeoutId);
			if (!socket.OPEN) {
				reject(new Error(`WebSocket connection closed: ${event.reason || 'Unknown reason'}`));
			}
		});
	});
}
