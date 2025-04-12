import { redirect, type Cookies } from '@sveltejs/kit';
import { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto';
import { HttpStatus } from '@totocorpsoftwareinc/frontend-toolkit';

const DEFAULT_COOKIES_OPT = {
	path: '/'
};

const COOKIE_KEY_CHAT_USER_ID = 'chat-user-id';

export { COOKIE_KEY_CHAT_USER_ID };

function validOrEmptyString(maybeValue: string | undefined, valid: boolean): string {
	return valid ? (maybeValue as string) : '';
}

export interface ChatCookies {
	readonly chatUserId: string;
}

export function setChatCookies(cookies: Cookies, chatUser: ChatUserResponseDto) {
	cookies.set(COOKIE_KEY_CHAT_USER_ID, chatUser.id, DEFAULT_COOKIES_OPT);
}

export function resetChatCookies(cookies: Cookies) {
	cookies.set(COOKIE_KEY_CHAT_USER_ID, '', DEFAULT_COOKIES_OPT);
}

export function loadChatCookies(cookies: Cookies): [boolean, ChatCookies] {
	const maybeChatUserId = cookies.get(COOKIE_KEY_CHAT_USER_ID);

	const validChatUserId = maybeChatUserId !== undefined && maybeChatUserId !== '';
	const valid = validChatUserId;

	const out: ChatCookies = {
		chatUserId: validOrEmptyString(maybeChatUserId, validChatUserId)
	};

	return [valid, out];
}

export function loadCookiesOrRedirectToLogin(cookies: Cookies): ChatCookies {
	const [valid, chatCookies] = loadChatCookies(cookies);
	if (!valid) {
		redirect(HttpStatus.SEE_OTHER, '/');
	}

	return chatCookies;
}
