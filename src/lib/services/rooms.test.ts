import { describe, it, assert, expect, afterEach } from 'vitest';
import fetchMock from 'fetch-mock';
import { getRoomsForUser, getUsersForRoom } from '$lib/services/rooms';
import { createRouteMatcher } from '$lib/services/testUtils';

describe('Get rooms for user', () => {
	afterEach(async () => {
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

describe('Get users for room', () => {
	afterEach(async () => {
		fetchMock.unmockGlobal();
		fetchMock.hardReset();
	});

	it('should use route from env and consistent with provided id', async () => {
		const expectedUrl =
			'http://localhost:60001/v1/chats/rooms/40d8bd94-04bd-42b2-ad67-1105fd7b865d/users';
		fetchMock.mockGlobal().route(createRouteMatcher(expectedUrl, 'get'), 200, 'getUsersForRoom');

		await getUsersForRoom('40d8bd94-04bd-42b2-ad67-1105fd7b865d');

		assert(fetchMock.callHistory.called('getUsersForRoom'));
	});

	it('should return data received from server', async () => {
		const mockedResponse = {
			requestId: '2fe6fb33-08a3-426b-ad51-ef4f8bf208fa',
			status: 'SUCCESS',
			details: [
				{
					id: '141e00ff-15bb-4f24-9291-a3b9885badf5',
					name: 'user-1',
					created_at: '2025-05-10T15:12:53.525234Z'
				}
			]
		};

		const expectedUrl =
			'http://localhost:60001/v1/chats/rooms/40d8bd94-04bd-42b2-ad67-1105fd7b865d/users';
		fetchMock.mockGlobal().get(createRouteMatcher(expectedUrl, 'get'), {
			status: 200,
			body: mockedResponse
		});

		const actual = await getUsersForRoom('40d8bd94-04bd-42b2-ad67-1105fd7b865d');

		expect(actual.is2xxOk()).toBe(true);
		expect(actual.getDetails()).toEqual([
			{
				id: '141e00ff-15bb-4f24-9291-a3b9885badf5',
				name: 'user-1',
				created_at: '2025-05-10T15:12:53.525234Z'
			}
		]);
	});
});
