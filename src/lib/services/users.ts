import { buildApiUrl } from '$lib/rest/api';
import { safeFetchJson, type ApiResponse } from '@totocorpsoftwareinc/frontend-toolkit';

export async function createChatUser(name: string): Promise<ApiResponse> {
	const url = buildApiUrl('users');
	const body = JSON.stringify({ name: name });

	const params = {
		method: 'POST',
		body: body,
		headers: {
			'content-type': 'application/json'
		}
	};

	return safeFetchJson(url, params);
}

export async function getChatUser(id: string): Promise<ApiResponse> {
	const url = buildApiUrl('users/' + id);

	const params = {
		method: 'GET'
	};

	return safeFetchJson(url, params);
}

export async function listUsersByName(name: string): Promise<ApiResponse> {
	// https://stackoverflow.com/questions/35038857/setting-query-string-using-fetch-get-request
	const queryParams = new URLSearchParams({
		name: name
	});

	const url = buildApiUrl('users?' + queryParams.toString());

	const params = {
		method: 'GET'
	};

	return safeFetchJson(url, params);
}
