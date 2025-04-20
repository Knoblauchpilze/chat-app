import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/node';

// https://github.com/mswjs/examples/tree/main/examples/with-vitest
beforeAll(() => {
	server.listen({
		onUnhandledRequest: 'error'
	});
});

afterEach(() => {
	server.resetHandlers();
});

afterAll(() => {
	server.close();
});
