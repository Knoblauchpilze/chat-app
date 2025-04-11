import { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto.js';
import { loadChatCookies, setChatCookies } from '$lib/cookies';
import { getErrorMessageFromApiResponse } from '$lib/rest/api';
import { createChatUser } from '$lib/services/users';
import { fail, redirect } from '@sveltejs/kit';
import {
	getHttpStatusCodeFromApiFailure,
	HttpStatus,
	parseApiResponseAsSingleValue,
	tryGetFailureReason
} from '@totocorpsoftwareinc/frontend-toolkit';

export async function load({ cookies }) {
	const [valid, chatData] = loadChatCookies(cookies);

	if (valid) {
		return {
			registered: true,
			user: {
				chatUser: chatData.chatUser,
				apiUser: chatData.apiUser,
				chatName: chatData.chatName
			}
		};
	}

	return {
		registered: false
	};
}

export const actions = {
	register: async ({ cookies, request }) => {
		const data = await request.formData();

		const name = data.get('handle');
		if (!name) {
			return fail(HttpStatus.UNPROCESSABLE_ENTITY, {
				message: 'Please fill in the screen name',
				name: name
			});
		}

		const apiResponse = await createChatUser(name as string);
		if (apiResponse.isError()) {
			const failure = tryGetFailureReason(apiResponse);
			const code = getHttpStatusCodeFromApiFailure(failure);

			return fail(code, {
				message: getErrorMessageFromApiResponse(apiResponse),
				name: name
			});
		}

		const chatUserDto = parseApiResponseAsSingleValue(apiResponse, ChatUserResponseDto);
		if (chatUserDto !== undefined) {
			setChatCookies(cookies, chatUserDto);
		} else {
			fail(HttpStatus.INTERNAL_SERVER_ERROR, {
				message: 'Failed to register user',
				name: name
			});
		}

		redirect(HttpStatus.SEE_OTHER, '/chats');
	}
};
