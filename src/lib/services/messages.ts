import { buildApiUrl } from '$lib/rest/api';
import { safeFetchJson, type ApiResponse } from '@totocorpsoftwareinc/frontend-toolkit';

export async function getMessagesForRoom(id: string): Promise<ApiResponse> {
	const url = buildApiUrl('rooms/' + id + '/messages');

	const params = {
		method: 'GET'
	};

	return safeFetchJson(url, params);
}

export async function sendMessage(
	user: string,
	room: string,
	message: string
): Promise<ApiResponse> {
	const url = buildApiUrl('rooms/' + room + '/messages');
	const body = JSON.stringify({
		user: user,
		room: room,
		message: message
	});

	const params = {
		method: 'POST',
		body: body,
		headers: {
			'content-type': 'application/json'
		}
	};

	return safeFetchJson(url, params);
}
