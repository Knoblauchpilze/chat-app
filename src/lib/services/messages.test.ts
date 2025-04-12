import { describe, it, assert, expect, afterEach } from 'vitest';
import fetchMock from 'fetch-mock';
import { getMessagesForRoom } from '$lib/services/messages';
import { createRouteMatcher } from '$lib/services/testUtils';

describe('Get messages for room', () => {
	afterEach(async () => {
		fetchMock.unmockGlobal();
		fetchMock.hardReset();
	});

	it('should use route from env and consistent with provided id', async () => {
		const expectedUrl =
			'http://localhost:60001/v1/chats/rooms/9d7dd545-d180-47c0-94b5-ddf7fa2e52af/messages';
		fetchMock.mockGlobal().route(createRouteMatcher(expectedUrl, 'get'), 200, 'getMessagesForRoom');

		await getMessagesForRoom('9d7dd545-d180-47c0-94b5-ddf7fa2e52af');

		assert(fetchMock.callHistory.called('getMessagesForRoom'));
	});

	it('should return data received from server', async () => {
		const mockedResponse = {
			requestId: '2fe6fb33-08a3-426b-ad51-ef4f8bf208fa',
			status: 'SUCCESS',
			details: [
				{
					id: 'fa5e2b80-1c1e-417a-8195-21cb5c60c4ae',
					user: '0198ed26-8e92-4b81-aec0-aaaff33b6a11',
					room: 'ef3cc94b-5142-4399-a366-70645a504219',
					message: 'This is empty here',
					created_at: '2025-04-06T18:50:40.525234Z'
				}
			]
		};

		const expectedUrl =
			'http://localhost:60001/v1/chats/rooms/9d7dd545-d180-47c0-94b5-ddf7fa2e52af/messages';
		fetchMock.mockGlobal().get(createRouteMatcher(expectedUrl, 'get'), {
			status: 200,
			body: mockedResponse
		});

		const actual = await getMessagesForRoom('9d7dd545-d180-47c0-94b5-ddf7fa2e52af');

		expect(actual.is2xxOk()).toBe(true);
		expect(actual.getDetails()).toEqual([
			{
				id: 'fa5e2b80-1c1e-417a-8195-21cb5c60c4ae',
				user: '0198ed26-8e92-4b81-aec0-aaaff33b6a11',
				room: 'ef3cc94b-5142-4399-a366-70645a504219',
				message: 'This is empty here',
				created_at: '2025-04-06T18:50:40.525234Z'
			}
		]);
	});
});
