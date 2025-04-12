import { describe, it, assert, expect, afterEach } from 'vitest';
import fetchMock from 'fetch-mock';
import { createChatUser, getChatUser, listUsersByName } from '$lib/services/users';
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

describe('Get chat user', () => {
	afterEach(async () => {
		fetchMock.unmockGlobal();
		fetchMock.hardReset();
	});

	it('should use route from env and consistent with provided id', async () => {
		const expectedUrl =
			'http://localhost:60001/v1/chats/users/5158aaa7-e540-432b-8cce-da9ccfe71d80';
		fetchMock.mockGlobal().route(createRouteMatcher(expectedUrl, 'get'), 200, 'getChatUserRoute');

		await getChatUser('5158aaa7-e540-432b-8cce-da9ccfe71d80');

		assert(fetchMock.callHistory.called('getChatUserRoute'));
	});

	it('should return data received from server', async () => {
		const mockedResponse = {
			requestId: '2fe6fb33-08a3-426b-ad51-ef4f8bf208fa',
			status: 'SUCCESS',
			details: {
				id: '0198ed26-8e92-4b81-aec0-aaaff33b6a11',
				name: 'user1',
				api_user: '0463ed3d-bfc9-4c10-b6ee-c223bbca0fab',
				created_at: '2025-04-06T18:50:40.525234Z'
			}
		};

		const expectedUrl =
			'http://localhost:60001/v1/chats/users/fe4cae61-7847-4342-a5d7-900576a81324';
		fetchMock.mockGlobal().get(createRouteMatcher(expectedUrl, 'get'), {
			status: 200,
			body: mockedResponse
		});

		const actual = await getChatUser('fe4cae61-7847-4342-a5d7-900576a81324');

		expect(actual.is2xxOk()).toBe(true);
		expect(actual.getDetails()).toEqual({
			id: '0198ed26-8e92-4b81-aec0-aaaff33b6a11',
			name: 'user1',
			api_user: '0463ed3d-bfc9-4c10-b6ee-c223bbca0fab',
			created_at: '2025-04-06T18:50:40.525234Z'
		});
	});
});

describe('List chat users by name', () => {
	afterEach(async () => {
		fetchMock.unmockGlobal();
		fetchMock.hardReset();
	});

	it('should use route from env and consistent with provided id', async () => {
		const expectedUrl = 'http://localhost:60001/v1/chats/users?name=user1';
		fetchMock
			.mockGlobal()
			.route(createRouteMatcher(expectedUrl, 'get'), 200, 'listChatUsersByNameRoute');

		await listUsersByName('user1');

		assert(fetchMock.callHistory.called('listChatUsersByNameRoute'));
	});

	it('should encode names with special characters', async () => {
		// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/toString
		// https://www.url-encode-decode.com/
		const expectedUrl =
			'http://localhost:60001/v1/chats/users?name=my+special+%2Fchars%5C+user+%F0%9F%98%8A+%26';
		fetchMock
			.mockGlobal()
			.route(createRouteMatcher(expectedUrl, 'get'), 200, 'listChatUsersByNameRoute');

		await listUsersByName('my special /chars\\ user 😊 &');

		assert(fetchMock.callHistory.called('listChatUsersByNameRoute'));
	});

	it('should return data received from server', async () => {
		const mockedResponse = {
			requestId: '2fe6fb33-08a3-426b-ad51-ef4f8bf208fa',
			status: 'SUCCESS',
			details: [
				{
					id: '0198ed26-8e92-4b81-aec0-aaaff33b6a11',
					name: 'user1',
					api_user: '0463ed3d-bfc9-4c10-b6ee-c223bbca0fab',
					created_at: '2025-04-06T18:50:40.525234Z'
				}
			]
		};

		const expectedUrl = 'http://localhost:60001/v1/chats/users?name=user1';
		fetchMock.mockGlobal().get(createRouteMatcher(expectedUrl, 'get'), {
			status: 200,
			body: mockedResponse
		});

		const actual = await listUsersByName('user1');

		expect(actual.is2xxOk()).toBe(true);
		expect(actual.getDetails()).toEqual([
			{
				id: '0198ed26-8e92-4b81-aec0-aaaff33b6a11',
				name: 'user1',
				api_user: '0463ed3d-bfc9-4c10-b6ee-c223bbca0fab',
				created_at: '2025-04-06T18:50:40.525234Z'
			}
		]);
	});
});
