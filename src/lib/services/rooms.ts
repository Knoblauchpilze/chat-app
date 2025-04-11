import { buildApiUrl } from '$lib/rest/api';
import { safeFetchJson, type ApiResponse } from '@totocorpsoftwareinc/frontend-toolkit';

export async function getRoomsForUser(id: string): Promise<ApiResponse> {
	const url = buildApiUrl('users/' + id + '/rooms');

	const params = {
		method: 'GET'
	};

	return safeFetchJson(url, params);
}
