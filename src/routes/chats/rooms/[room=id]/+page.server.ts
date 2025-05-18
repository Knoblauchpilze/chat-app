import { loadCookiesOrRedirectToLogin, resetChatCookies } from '$lib/cookies';
import { handleApiError } from '$lib/rest/api';
import { getChatUser } from '$lib/services/users';
import { chatUserResponseDtoToChatUserUiDto } from '$lib/converters/chatUserConverter';
import { error, fail, redirect } from '@sveltejs/kit';
import {
	HttpStatus,
	parseApiResponseAsArray,
	parseApiResponseAsSingleValue
} from '@totocorpsoftwareinc/frontend-toolkit';
import { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto';
import { getRooms, getRoomsForUser, getUsersForRoom } from '$lib/services/rooms';
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

	const otherRooms = allRooms.filter((room) => userRooms.includes(room) === false);

	return {
		user: chatUserResponseDtoToChatUserUiDto(chatUserDto),
		room: params.room,
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
	joinRoom: async ({ request }) => {
		const data = await request.formData();

		const roomId = data.get('room');
		if (!roomId) {
			return fail(HttpStatus.UNPROCESSABLE_ENTITY, {
				message: 'Please fill in the room to join',
				roomId: roomId
			});
		}

		redirect(HttpStatus.SEE_OTHER, '/chats/rooms/' + roomId);
	}
};
