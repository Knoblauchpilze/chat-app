import { error } from '@sveltejs/kit';
import { RoomResponseDto } from '$lib/communication/api/roomResponseDto';
import { loadCookiesOrRedirectToLogin } from '$lib/cookies';
import { getRoomsForUser } from '$lib/services/rooms';
import {
	getHttpStatusCodeFromApiFailure,
	HttpStatus,
	parseApiResponseAsArray,
	tryGetFailureReason
} from '@totocorpsoftwareinc/frontend-toolkit';

export async function load({ cookies }) {
	const chatCookies = loadCookiesOrRedirectToLogin(cookies);
	const apiResponse = await getRoomsForUser(chatCookies.chatUserId);
	if (apiResponse.isError()) {
		const failure = tryGetFailureReason(apiResponse);
		const code = getHttpStatusCodeFromApiFailure(failure);
		return error(HttpStatus.INTERNAL_SERVER_ERROR, `Failed to get rooms data: ${code}`);
	}
	const rooms = parseApiResponseAsArray(apiResponse, RoomResponseDto);
	if (rooms === undefined || rooms.length === 0) {
		return error(HttpStatus.INTERNAL_SERVER_ERROR, `No rooms found for your user!`);
	}

	// TODO: Should redirect when the promise is resolved
	// redirect(HttpStatus.SEE_OTHER, '/chats/rooms/' + rooms[0].id);
}
