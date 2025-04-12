import { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto';
import { RoomResponseDto } from '$lib/communication/api/roomResponseDto.js';
import { loadChatCookies, resetChatCookies, setChatCookies } from '$lib/cookies';
import { getErrorMessageFromApiResponse } from '$lib/rest/api';
import { getRoomsForUser } from '$lib/services/rooms.js';
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

		resetChatCookies(cookies);

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

		let chatUserDto: ChatUserResponseDto | undefined = undefined;

		if (!userExists) {
			chatUserDto = parseApiResponseAsSingleValue(apiResponse, ChatUserResponseDto);

			if (chatUserDto === undefined) {
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

			chatUserDto = chatUserDtos[0];
		}

		if (chatUserDto === undefined) {
			return fail(HttpStatus.INTERNAL_SERVER_ERROR, {
				message: 'Failed to join chat',
				name: name
			});
		}

		apiResponse = await getRoomsForUser(chatUserDto.id);
		if (apiResponse.isError()) {
			const failure = tryGetFailureReason(apiResponse);
			const code = getHttpStatusCodeFromApiFailure(failure);

			return fail(code, {
				message: getErrorMessageFromApiResponse(apiResponse),
				name: name
			});
		}

		console.log('response: ', JSON.stringify(apiResponse));

		const rooms = parseApiResponseAsArray(apiResponse, RoomResponseDto);
		if (rooms === undefined || rooms.length === 0) {
			console.log('haha: ', JSON.stringify(apiResponse));
			return fail(HttpStatus.NOT_FOUND, {
				message: "You don't even have a room dude!",
				name: name
			});
		}

		setChatCookies(cookies, chatUserDto);

		console.log('unbelievable: ', JSON.stringify(rooms));

		redirect(HttpStatus.SEE_OTHER, '/chats/' + rooms[0].id);
	}
};
