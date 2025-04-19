import { parse as uuidParse } from 'uuid';
import { buildTcpUrl, type ConnectionProps } from '$lib/tcp/utils';

const DEFAULT_CONNECT_TIMEOUT_MS = 5000;

export function connectToServer(props: ConnectionProps): Promise<WebSocket> {
	return new Promise((resolve, reject) => {
		const url = buildTcpUrl(props);
		const socket = new WebSocket(url);

		const connectTimeout = props.connectionTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS;
		const timeoutId = setTimeout(() => {
			socket.close();
			reject(new Error(`Connection timeout after ${connectTimeout}ms`));
		}, connectTimeout);

		socket.onopen = () => {
			clearTimeout(timeoutId);

			// https://www.npmjs.com/package/uuid#uuidparsestr
			const dataToSend = uuidParse(props.clientId);

			socket.send(dataToSend);

			resolve(socket);
		};

		socket.onerror = (event) => {
			clearTimeout(timeoutId);
			const error = event as ErrorEvent;
			reject(new Error(error.message));
		};

		socket.onclose = (event) => {
			clearTimeout(timeoutId);
			if (!socket.OPEN) {
				reject(new Error(`WebSocket connection closed: ${event.reason || 'Unknown reason'}`));
			}
		};
	});
}
