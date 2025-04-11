import { loadCookiesOrRedirectToLogin, resetChatCookies } from '$lib/cookies';
import { handleApiError } from '$lib/rest/api';
import { getChatUser } from '$lib/services/users';
import { chatUserResponseDtoToChatUserUiDto } from '$lib/converters/chatUserConverter';
import { error, redirect } from '@sveltejs/kit';
import { HttpStatus, parseApiResponseAsSingleValue } from '@totocorpsoftwareinc/frontend-toolkit';
import { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto';

export async function load({ cookies }) {
	const chatCookies = loadCookiesOrRedirectToLogin(cookies);

	const apiResponse = await getChatUser(chatCookies.chatUser);
	handleApiError(apiResponse);

	const chatUserDto = parseApiResponseAsSingleValue(apiResponse, ChatUserResponseDto);
	if (chatUserDto === undefined) {
		error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to get server data');
	}

	return {
		user: chatUserResponseDtoToChatUserUiDto(chatUserDto)
	};
}

export const actions = {
	logout: async ({ cookies }) => {
		resetChatCookies(cookies);

		redirect(HttpStatus.SEE_OTHER, '/');
	}
};
