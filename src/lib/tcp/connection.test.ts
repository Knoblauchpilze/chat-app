import { describe, expect, it } from 'vitest';
import { Connection } from '$lib/tcp/connection';
import { server } from '$tests/mocks/node';
import { chats } from '$tests/mocks/chats';
import { TEST_SERVER_HOST, TEST_SERVER_PORT } from '$tests/mocks/constants';

const SAMPLE_UUID = 'ac9569ad-428d-4967-92fd-b806abb5e012';
const TEST_SOCKET_PROPS = {
	host: TEST_SERVER_HOST,
	port: TEST_SERVER_PORT,
	clientId: SAMPLE_UUID
};

describe('Connection', () => {
	it('connects to server successfully', async () => {
		const handlers = [chats.addEventListener('connection', () => {})];
		server.use(...handlers);

		const conn = new Connection(TEST_SOCKET_PROPS);

		// https://v0.vitest.dev/api/expect.html#rejects
		await expect(conn.socket).resolves.toSatisfy((s) => s.readyState === WebSocket.OPEN);
	});
});
