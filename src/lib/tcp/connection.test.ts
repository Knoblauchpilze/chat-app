import { describe, expect, it } from 'vitest';
import { Connection } from '$lib/tcp/connection';

describe('Connection', () => {
	it('raises error when connection fails', async () => {
		const props = {
			host: 'localhost',
			port: 9999,
			clientId: 'dd96d560-e9da-4061-8b0d-34552c487153',
			connectTimeoutMs: 500
		};

		const conn = new Connection(props);
		// https://v0.vitest.dev/api/expect.html#rejects
		await expect(conn.socket).rejects.toThrow('connect ECONNREFUSED 127.0.0.1:9999');
	});

	it('raises error when connection fails', async () => {
		const props = {
			host: 'localhost',
			port: 9999,
			clientId: 'dd96d560-e9da-4061-8b0d-34552c487153',
			connectTimeoutMs: 500
		};

		const conn = new Connection(props);
		// https://v0.vitest.dev/api/expect.html#rejects
		await expect(conn.socket).rejects.toThrow('connect ECONNREFUSED 127.0.0.1:9999');
	});
});
