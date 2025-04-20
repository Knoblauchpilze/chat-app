import { describe, it, expect, assert } from 'vitest';
import { connectToServer } from '$lib/tcp/connect';
import { stringify as uuidStringify } from 'uuid';
import { server } from '$tests/mocks/node';
import { chats } from '$tests/mocks/chats';
import { TEST_SERVER_HOST, TEST_SERVER_PORT } from '$tests/mocks/constants';
import { waitFor } from '$tests/utils';

const SAMPLE_UUID = 'ac9569ad-428d-4967-92fd-b806abb5e012';
const TEST_SOCKET_PROPS = {
	host: TEST_SERVER_HOST,
	port: TEST_SERVER_PORT,
	clientId: SAMPLE_UUID
};

describe('Connect to server', () => {
	it('successfully connects to server', async () => {
		const handlers = [chats.addEventListener('connection', () => {})];
		// https://github.com/mswjs/msw/discussions/1495
		server.use(...handlers);

		const socket = await connectToServer(TEST_SOCKET_PROPS);

		expect(socket.readyState).toBe(WebSocket.OPEN);

		socket.close();
	});

	it('sends client id in handshake', async () => {
		const handlers = [
			chats.addEventListener('connection', ({ client }) => {
				client.addEventListener('message', (event) => {
					// https://www.npmjs.com/package/uuid#uuidstringifyarr-offset
					assert(event.data instanceof Uint8Array);
					const clientId = uuidStringify(event.data);
					expect(clientId).toBe(SAMPLE_UUID);
				});
			})
		];
		server.use(...handlers);

		const socket = await connectToServer(TEST_SOCKET_PROPS);

		expect(socket.readyState).toBe(WebSocket.OPEN);

		socket.close();
	});

	it('when connection is lost, expect socket to be closed', async () => {
		const CONN_TIMEOUT_MS = 50;
		const handlers = [
			chats.addEventListener('connection', async ({ client }) => {
				setTimeout(() => {
					client.close(1000, 'connection closed');
				}, CONN_TIMEOUT_MS);
			})
		];
		server.use(...handlers);

		const socket = await connectToServer(TEST_SOCKET_PROPS);

		await waitFor(100);
		await expect(socket.readyState).toBe(WebSocket.CLOSED);
	});
});
