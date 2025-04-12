import { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto';
import { loadChatCookies, setChatCookies } from '$lib/cookies';
import { getErrorMessageFromApiResponse } from '$lib/rest/api';
import { createChatUser, listUsersByName } from '$lib/services/users';
import { fail, redirect } from '@sveltejs/kit';
import {
	getHttpStatusCodeFromApiFailure,
	HttpStatus,
	parseApiResponseAsArray,
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

		let userExists = false;
		let apiResponse = await createChatUser(name as string);

		if (apiResponse.statusCode() == HttpStatus.CONFLICT) {
			apiResponse = await listUsersByName(name as string);
			userExists = apiResponse.isSuccess();
		}

		if (apiResponse.isError()) {
			const failure = tryGetFailureReason(apiResponse);
			const code = getHttpStatusCodeFromApiFailure(failure);

			return fail(code, {
				message: getErrorMessageFromApiResponse(apiResponse),
				name: name
			});
		}

		if (!userExists) {
			const chatUserDto = parseApiResponseAsSingleValue(apiResponse, ChatUserResponseDto);

			if (chatUserDto !== undefined) {
				setChatCookies(cookies, chatUserDto);
			} else {
				fail(HttpStatus.INTERNAL_SERVER_ERROR, {
					message: 'Failed to register user',
					name: name
				});
			}
		} else {
			const chatUserDtos = parseApiResponseAsArray(apiResponse, ChatUserResponseDto);
			if (chatUserDtos.length !== 1) {
				return fail(HttpStatus.INTERNAL_SERVER_ERROR, {
					message: 'Unexpected server response for user data',
					name: name
				});
			}

			setChatCookies(cookies, chatUserDtos[0]);
		}

		redirect(HttpStatus.SEE_OTHER, '/chats');
	}
};
