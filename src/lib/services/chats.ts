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
