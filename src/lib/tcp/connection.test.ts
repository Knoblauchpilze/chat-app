import { describe, it, expect, beforeEach, afterEach, assert } from 'vitest';
import { connectToServer } from '$lib/tcp/connection';
import { stringify as uuidStringify } from 'uuid';
import { WebSocketServer } from 'ws';

const SAMPLE_UUID = 'ac9569ad-428d-4967-92fd-b806abb5e012';
const SERVER_PORT = 6789;

describe('Connect to server', () => {
	let server: WebSocketServer;
	let receivedClientIds: string[] = [];

	beforeEach(async () => {
		receivedClientIds = [];

		// https://github.com/websockets/ws?tab=readme-ov-file#simple-server
		server = new WebSocketServer({ port: SERVER_PORT });

		server.on('connection', (ws) => {
			ws.on('message', (data) => {
				try {
					assert(data instanceof Buffer);

					// https://www.npmjs.com/package/uuid#uuidstringifyarr-offset
					const clientId = uuidStringify(data);
					receivedClientIds.push(clientId);
				} catch (err) {
					// TODO: Handle this in a better way
					console.error('Error processing message:', err);
				}
			});
		});

		await new Promise<void>((resolve) => {
			server.once('listening', () => resolve());
		});
	});

	afterEach(async () => {
		await new Promise<void>((resolve) => {
			server.close(() => resolve());
		});
	});

	it('successfully connects to server', async () => {
		const socket = await connectToServer({
			host: 'localhost',
			port: SERVER_PORT,
			clientId: SAMPLE_UUID
		});

		expect(socket.readyState).toBe(WebSocket.OPEN);

		const REASONABLE_RESOLVE_TIMEOUT_MS = 100;
		await new Promise((resolve) => setTimeout(resolve, REASONABLE_RESOLVE_TIMEOUT_MS));

		socket.close();
	});

	it('sends client id in handshake', async () => {
		const socket = await connectToServer({
			host: 'localhost',
			port: SERVER_PORT,
			clientId: SAMPLE_UUID
		});

		expect(socket.readyState).toBe(WebSocket.OPEN);

		// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
		const REASONABLE_RESOLVE_TIMEOUT_MS = 100;
		await new Promise((resolve) => setTimeout(resolve, REASONABLE_RESOLVE_TIMEOUT_MS));

		expect(receivedClientIds).toHaveLength(1);
		expect(receivedClientIds).toContain(SAMPLE_UUID);

		socket.close();
	});
});
