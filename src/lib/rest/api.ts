import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import {
	ApiFailure,
	ApiResponse,
	trimTrailingSlash,
	tryGetFailureReason,
	getHttpStatusCodeFromApiFailure
} from '@totocorpsoftwareinc/frontend-toolkit';

export function buildApiUrl(url: string): string {
	const out = trimTrailingSlash(PUBLIC_API_BASE_URL);

	if (url.length === 0) {
		return out;
	}
	return out + '/' + url;
}

function getErrorMessageFromApiFailure(failure: ApiFailure): string {
	switch (failure) {
		default:
			return 'An unexpected error occurred (' + failure + ')';
	}
}

export function getErrorMessageFromApiResponse(response: ApiResponse): string {
	if (!response.isError()) {
		return '';
	}

	const reason = tryGetFailureReason(response);
	return getErrorMessageFromApiFailure(reason);
}

export function handleApiError(response: ApiResponse) {
	if (!response.isError()) {
		return '';
	}

	const reason = tryGetFailureReason(response);
	const message = getErrorMessageFromApiFailure(reason);
	const code = getHttpStatusCodeFromApiFailure(reason);

	// https://kit.svelte.dev/docs/errors
	error(code, { message: message });
}
