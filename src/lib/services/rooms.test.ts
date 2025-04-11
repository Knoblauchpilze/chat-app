import { describe, it, assert, expect, afterEach } from 'vitest';
import fetchMock from 'fetch-mock';
import { getRoomsForUser } from '$lib/services/rooms';
import { createRouteMatcher } from '$lib/services/testUtils';

describe('Get rooms for user', () => {
	// https://vitest.dev/api/#aftereach
	afterEach(async () => {
		// https://www.wheresrhys.co.uk/fetch-mock/docs/API/resetting
		fetchMock.unmockGlobal();
		fetchMock.hardReset();
	});

	it('should use route from env and consistent with provided id', async () => {
		const expectedUrl =
			'http://localhost:60001/v1/chats/users/fe4cae61-7847-4342-a5d7-900576a81324/rooms';
		fetchMock.mockGlobal().route(createRouteMatcher(expectedUrl, 'get'), 200, 'getRoomsForUser');

		await getRoomsForUser('fe4cae61-7847-4342-a5d7-900576a81324');

		assert(fetchMock.callHistory.called('getRoomsForUser'));
	});

	it('should return data received from server', async () => {
		const mockedResponse = {
			requestId: '2fe6fb33-08a3-426b-ad51-ef4f8bf208fa',
			status: 'SUCCESS',
			details: [
				{
					id: 'ef3cc94b-5142-4399-a366-70645a504219',
					name: 'room-1',
					created_at: '2025-04-06T18:50:40.525234Z'
				}
			]
		};

		const expectedUrl =
			'http://localhost:60001/v1/chats/users/fe4cae61-7847-4342-a5d7-900576a81324/rooms';
		fetchMock.mockGlobal().get(createRouteMatcher(expectedUrl, 'get'), {
			status: 200,
			body: mockedResponse
		});

		const actual = await getRoomsForUser('fe4cae61-7847-4342-a5d7-900576a81324');

		expect(actual.is2xxOk()).toBe(true);
		expect(actual.getDetails()).toEqual([
			{
				id: 'ef3cc94b-5142-4399-a366-70645a504219',
				name: 'room-1',
				created_at: '2025-04-06T18:50:40.525234Z'
			}
		]);
	});
});
