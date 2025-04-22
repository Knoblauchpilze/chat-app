import { parse as uuidParse } from 'uuid';
import { buildTcpUrl, type ConnectionProps } from '$lib/tcp/utils';
import { analyzeCloseEvent } from '$lib/tcp/analyseCloseEvent';

const DEFAULT_CONNECT_TIMEOUT_MS = 5000;

export function connectToServer(props: ConnectionProps): Promise<WebSocket> {
	return new Promise((resolve, reject) => {
		const url = buildTcpUrl(props);
		const socket = new WebSocket(url);

		const connectTimeout = props.connectionTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS;
		const timeoutId = setTimeout(() => {
			socket.close();
			reject(new Error('could not connect to server'));
		}, connectTimeout);

		socket.onopen = () => {
			clearTimeout(timeoutId);
			console.log('opened successfully');

			// https://www.npmjs.com/package/uuid#uuidparsestr
			const dataToSend = uuidParse(props.clientId);

			socket.send(dataToSend);

			resolve(socket);
		};

		// TODO: We could send something from the server to indicate that the connection
		// is accepted.

		socket.onerror = (event) => {
			clearTimeout(timeoutId);
			console.log('error event: ', event);
		};

		socket.onclose = (event) => {
			clearTimeout(timeoutId);
			if (socket.readyState !== socket.OPEN) {
				reject(analyzeCloseEvent(event));
			}
		};
	});
}
