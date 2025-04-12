import { buildApiUrl } from '$lib/rest/api';
import { safeFetchJson, type ApiResponse } from '@totocorpsoftwareinc/frontend-toolkit';

export async function getMessagesForRoom(id: string): Promise<ApiResponse> {
	const url = buildApiUrl('rooms/' + id + '/messages');

	const params = {
		method: 'GET'
	};

	return safeFetchJson(url, params);
}
