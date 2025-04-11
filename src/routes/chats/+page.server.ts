import { loadCookiesOrRedirectToLogin, resetChatCookies } from '$lib/cookies';
import { handleApiError } from '$lib/rest/api';
import { getChatUser } from '$lib/services/users';
import { chatUserResponseDtoToChatUserUiDto } from '$lib/converters/chatUserConverter';
import { error, redirect } from '@sveltejs/kit';
import {
	HttpStatus,
	parseApiResponseAsArray,
	parseApiResponseAsSingleValue
} from '@totocorpsoftwareinc/frontend-toolkit';
import { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto';
import { getRoomsForUser } from '$lib/services/rooms';
import { RoomResponseDto } from '$lib/communication/api/roomResponseDto';
import { roomResponseDtoToRoomUiDto } from '$lib/converters/roomConverter.js';

export async function load({ cookies }) {
	const chatCookies = loadCookiesOrRedirectToLogin(cookies);

	// Fetch the user's data
	let apiResponse = await getChatUser(chatCookies.chatUser);
	handleApiError(apiResponse);

	const chatUserDto = parseApiResponseAsSingleValue(apiResponse, ChatUserResponseDto);
	if (chatUserDto === undefined) {
		error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to get server data');
	}

	// Fetch the rooms the user belongs to
	apiResponse = await getRoomsForUser(chatUserDto.id);
	handleApiError(apiResponse);

	const rooms = parseApiResponseAsArray(apiResponse, RoomResponseDto);
	if (chatUserDto === undefined) {
		error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to get server data');
	}

	return {
		user: chatUserResponseDtoToChatUserUiDto(chatUserDto),
		rooms: rooms.map((room) => roomResponseDtoToRoomUiDto(room))
	};
}

export const actions = {
	logout: async ({ cookies }) => {
		resetChatCookies(cookies);

		redirect(HttpStatus.SEE_OTHER, '/');
	}
};
