import { describe, it, assert, expect, afterEach } from 'vitest';
import fetchMock from 'fetch-mock';
import { createChatUser } from '$lib/services/users';
import { createRouteMatcher } from '$lib/services/testUtils';

describe('Create chat user', () => {
	// https://vitest.dev/api/#aftereach
	afterEach(async () => {
		// https://www.wheresrhys.co.uk/fetch-mock/docs/API/resetting
		fetchMock.unmockGlobal();
		fetchMock.hardReset();
	});

	it('should use route from env', async () => {
		fetchMock
			.mockGlobal()
			.route(
				createRouteMatcher('http://localhost:60001/v1/chats/users', 'post', 'application/json'),
				201,
				'createChatUserRoute'
			);

		await createChatUser('my_user');

		assert(fetchMock.callHistory.called('createChatUserRoute'));
	});

	it('should send request consistent with input name', async () => {
		const expectedBody = JSON.stringify({ name: 'my_user' });

		fetchMock
			.mockGlobal()
			.route(
				createRouteMatcher(
					'http://localhost:60001/v1/chats/users',
					'post',
					'application/json',
					expectedBody
				),
				201,
				'createChatUserRoute'
			);

		await createChatUser('my_user');

		assert(fetchMock.callHistory.called('createChatUserRoute'));
	});

	it('should return data received from server', async () => {
		const mockedResponse = {
			requestId: '2fe6fb33-08a3-426b-ad51-ef4f8bf208fa',
			status: 'SUCCESS',
			details: {
				id: 'aba506af-c236-4ca1-8901-04d7e52dac26',
				name: 'my_user',
				api_user: '00000000-0000-0000-0000-000000000000',
				created_at: '2025-04-08T18:15:52.639255Z'
			}
		};
		fetchMock.mockGlobal().post('http://localhost:60001/v1/chats/users', {
			status: 201,
			body: mockedResponse
		});

		const actual = await createChatUser('my_user');

		expect(actual.is2xxOk()).toBe(true);
		expect(actual.getDetails()).toEqual({
			id: 'aba506af-c236-4ca1-8901-04d7e52dac26',
			name: 'my_user',
			api_user: '00000000-0000-0000-0000-000000000000',
			created_at: '2025-04-08T18:15:52.639255Z'
		});
	});
});
