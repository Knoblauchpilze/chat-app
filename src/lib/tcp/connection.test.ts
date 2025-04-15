import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { connectToServer } from '$lib/tcp/connection';
import net from 'net';
import { stringify as uuidStringify } from 'uuid';

const SAMPLE_UUID = 'ac9569ad-428d-4967-92fd-b806abb5e012';

describe('Connect to server', () => {
	let server: net.Server;
	let port: number;
	let clientIds: string[] = [];

	beforeEach(async () => {
		clientIds = [];
		server = net.createServer((socket) => {
			socket.once('data', (data) => {
				// https://www.npmjs.com/package/uuid#uuidstringifyarr-offset
				clientIds.push(uuidStringify(data));
			});

			socket.on('error', (error) => {
				// TODO: Properly handle test errors.
				console.error('Socket error:', error);
			});
		});

		await new Promise<void>((resolve) => {
			server.listen(0, '127.0.0.1', () => {
				const address = server.address();
				if (address && typeof address === 'object') {
					port = address.port;
				}
				resolve();
			});
		});

		server.on('error', (error) => {
			console.error('Server error:', error);
		});
	});

	afterEach(async () => {
		await new Promise<void>((resolve) => {
			server.close(() => resolve());
		});
	});

	it('autogenerated', async () => {
		const socket = await connectToServer({
			host: '127.0.0.1',
			port: port,
			clientId: SAMPLE_UUID
		});

		expect(socket.connecting).toBe(false);
		expect(socket.destroyed).toBe(false);

		const REASONABLE_RESOLVE_TIMEOUT_MS = 100;
		await new Promise((resolve) => setTimeout(resolve, REASONABLE_RESOLVE_TIMEOUT_MS));

		expect(clientIds).toHaveLength(1);
		expect(clientIds).toContain(SAMPLE_UUID);
		socket.end();
	});
});
