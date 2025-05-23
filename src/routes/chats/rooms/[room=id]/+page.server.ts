import { loadCookiesOrRedirectToLogin, resetChatCookies } from '$lib/cookies';
import { getErrorMessageFromApiResponse, handleApiError } from '$lib/rest/api';
import { getChatUser } from '$lib/services/users';
import { chatUserResponseDtoToChatUserUiDto } from '$lib/converters/chatUserConverter';
import { error, fail, redirect } from '@sveltejs/kit';
import {
	getHttpStatusCodeFromApiFailure,
	HttpStatus,
	parseApiResponseAsArray,
	parseApiResponseAsSingleValue,
	tryGetFailureReason
} from '@totocorpsoftwareinc/frontend-toolkit';
import { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto';
import {
	getRooms,
	getRoomsForUser,
	getUsersForRoom,
	joinRoom,
	leaveRoom
} from '$lib/services/rooms';
import { RoomResponseDto } from '$lib/communication/api/roomResponseDto';
import { roomResponseDtoToRoomUiDto } from '$lib/converters/roomConverter';
import { getMessagesForRoom } from '$lib/services/messages';
import { MessageResponseDto } from '$lib/communication/api/messageResponseDto';
import { messageResponseDtoToMessageUiDto } from '$lib/converters/messageConverter';

export async function load({ params, cookies }) {
	const chatCookies = loadCookiesOrRedirectToLogin(cookies);

	// Fetch the user's data
	let apiResponse = await getChatUser(chatCookies.chatUserId);
	handleApiError(apiResponse);

	const chatUserDto = parseApiResponseAsSingleValue(apiResponse, ChatUserResponseDto);
	if (chatUserDto === undefined) {
		error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to get user data');
	}

	// Fetch the rooms the user belongs to
	apiResponse = await getRoomsForUser(chatUserDto.id);
	handleApiError(apiResponse);

	const userRooms = parseApiResponseAsArray(apiResponse, RoomResponseDto);
	if (userRooms === undefined) {
		error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get user's rooms data");
	}

	// Verify that the user belong to the current room
	const belongs = userRooms.findIndex((room) => room.id === params.room) !== -1;
	if (!belongs) {
		error(HttpStatus.FORBIDDEN, 'You are not allowed to access this room');
	}

	const room = userRooms.find((room) => room.id === params.room);
	if (room === undefined) {
		error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to get room data');
	}

	// Fetch the messages for the current room
	apiResponse = await getMessagesForRoom(params.room);
	handleApiError(apiResponse);

	const messages = parseApiResponseAsArray(apiResponse, MessageResponseDto);
	if (messages === undefined) {
		error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to get messages data');
	}

	// Fetch the users for the current room
	apiResponse = await getUsersForRoom(params.room);
	handleApiError(apiResponse);

	const users = parseApiResponseAsArray(apiResponse, ChatUserResponseDto);
	if (users === undefined) {
		error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to get users data');
	}

	// Fetch all the other rooms available on the server
	apiResponse = await getRooms();
	handleApiError(apiResponse);

	const allRooms = parseApiResponseAsArray(apiResponse, RoomResponseDto);
	if (allRooms === undefined) {
		error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to get rooms data');
	}

	const otherRooms = allRooms.filter((room) => userRooms.findIndex((r) => r.id === room.id) === -1);

	return {
		user: chatUserResponseDtoToChatUserUiDto(chatUserDto),
		room: params.room,
		roomName: room.name,
		userRooms: userRooms.map((room) => roomResponseDtoToRoomUiDto(room)),
		rooms: otherRooms.map((room) => roomResponseDtoToRoomUiDto(room)),
		messages: messages.map((message) => messageResponseDtoToMessageUiDto(message, users)),
		users: users.map((user) => chatUserResponseDtoToChatUserUiDto(user))
	};
}

export const actions = {
	logout: async ({ cookies }) => {
		resetChatCookies(cookies);

		redirect(HttpStatus.SEE_OTHER, '/');
	},
	joinRoom: async ({ cookies, request }) => {
		const chatCookies = loadCookiesOrRedirectToLogin(cookies);

		const data = await request.formData();

		const roomId = data.get('room');
		if (!roomId) {
			return fail(HttpStatus.UNPROCESSABLE_ENTITY, {
				message: 'Please fill in the room to join',
				roomId: roomId
			});
		}

		const apiResponse = await joinRoom(chatCookies.chatUserId, roomId as string);

		if (apiResponse.isError()) {
			const failure = tryGetFailureReason(apiResponse);

			const code = getHttpStatusCodeFromApiFailure(failure);

			return fail(code, {
				message: getErrorMessageFromApiResponse(apiResponse),

				roomId: roomId
			});
		}

		redirect(HttpStatus.SEE_OTHER, '/chats/rooms/' + roomId);
	},
	leaveRoom: async ({ cookies, request, params }) => {
		const chatCookies = loadCookiesOrRedirectToLogin(cookies);

		const data = await request.formData();

		const roomId = data.get('roomId');
		if (!roomId) {
			return fail(HttpStatus.UNPROCESSABLE_ENTITY, {
				message: 'Please fill in the room to join',
				roomId: roomId
			});
		}

		let apiResponse = await leaveRoom(chatCookies.chatUserId, roomId as string);

		if (apiResponse.isError()) {
			const failure = tryGetFailureReason(apiResponse);

			const code = getHttpStatusCodeFromApiFailure(failure);

			return fail(code, {
				message: getErrorMessageFromApiResponse(apiResponse),

				roomId: roomId
			});
		}

		// In case the user left the current room, we need to redirect to another one.
		// Otherwise we can just stay on the same room.
		if (roomId !== params.room) {
			redirect(HttpStatus.SEE_OTHER, '/chats/rooms/' + params.room);
		}

		// Fetch the rooms the user belongs to
		apiResponse = await getRoomsForUser(chatCookies.chatUserId);
		handleApiError(apiResponse);

		const userRooms = parseApiResponseAsArray(apiResponse, RoomResponseDto);
		if (userRooms === undefined || userRooms.length === 0) {
			error(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get user's rooms data");
		}

		redirect(HttpStatus.SEE_OTHER, '/chats/rooms/' + userRooms[0].id);
	}
};
