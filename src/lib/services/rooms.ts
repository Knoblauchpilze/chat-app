import { buildApiUrl } from '$lib/rest/api';
import { safeFetchJson, type ApiResponse } from '@totocorpsoftwareinc/frontend-toolkit';

export async function getRoomsForUser(id: string): Promise<ApiResponse> {
	const url = buildApiUrl('users/' + id + '/rooms');

	const params = {
		method: 'GET'
	};

	return safeFetchJson(url, params);
}

export async function getUsersForRoom(id: string): Promise<ApiResponse> {
	const url = buildApiUrl('rooms/' + id + '/users');

	const params = {
		method: 'GET'
	};

	return safeFetchJson(url, params);
}

export async function getRooms(): Promise<ApiResponse> {
	const url = buildApiUrl('rooms');

	const params = {
		method: 'GET'
	};

	return safeFetchJson(url, params);
}

export async function joinRoom(user: string, room: string): Promise<ApiResponse> {
	const url = buildApiUrl('rooms/' + room + '/users');
	const body = JSON.stringify({ chat_user: user });

	const params = {
		method: 'POST',
		body: body,
		headers: {
			'content-type': 'application/json'
		}
	};

	return safeFetchJson(url, params);
}

export async function leaveRoom(user: string, room: string): Promise<ApiResponse> {
	const url = buildApiUrl('rooms/' + room + '/users/' + user);

	const params = {
		method: 'DELETE'
	};

	return safeFetchJson(url, params);
}
