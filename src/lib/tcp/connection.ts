import net from 'net';
import { parse as uuidParse } from 'uuid';

export interface SocketProps {
	host: string;
	port: number;
	clientId: string;
}

const DEFAULT_CONNECT_TIMEOUT_MS = 5000;

export function connectToServer(props: SocketProps): Promise<net.Socket> {
	return new Promise((resolve, reject) => {
		// https://cs.lmu.edu/~ray/notes/jsnetexamples/
		// https://stackoverflow.com/questions/4973622/difference-between-socket-and-websocket
		const client = new net.Socket();

		const timeoutId = setTimeout(() => {
			client.destroy();
			reject(new Error(`Connection timeout after ${DEFAULT_CONNECT_TIMEOUT_MS}ms`));
		}, DEFAULT_CONNECT_TIMEOUT_MS);

		client.on('connect', () => {
			clearTimeout(timeoutId);

			// https://www.npmjs.com/package/uuid#uuidparsestr
			const dataToSend = uuidParse(props.clientId);

			const writeSuccess = client.write(dataToSend, (err) => {
				if (err) {
					client.destroy();
					reject(new Error(`Failed to send client ID: ${err?.message}`));
					return;
				}

				// Successfully connected and sent client ID
				resolve(client);
			});

			if (!writeSuccess) {
				client.once('drain', () => {
					resolve(client);
				});
			}
		});

		client.on('error', (err) => {
			clearTimeout(timeoutId);
			reject(new Error(`Connection error: ${err.message}`));
		});

		client.connect({
			host: props.host,
			port: props.port
		});
	});
}
