import { redirect, type Cookies } from '@sveltejs/kit';
import { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto';
import { HttpStatus } from '@totocorpsoftwareinc/frontend-toolkit';

const DEFAULT_COOKIES_OPT = {
	path: '/'
};

const COOKIE_KEY_CHAT_USER = 'chat-user';
const COOKIE_KEY_API_USER = 'api-user';
const COOKIE_KEY_CHAT_NAME = 'chat-name';

export { COOKIE_KEY_API_USER, COOKIE_KEY_CHAT_USER, COOKIE_KEY_CHAT_NAME };

function validOrEmptyString(maybeValue: string | undefined, valid: boolean): string {
	return valid ? (maybeValue as string) : '';
}

export interface ChatCookies {
	readonly chatUser: string;
	readonly apiUser: string;
	readonly chatName: string;
}

export function setChatCookies(cookies: Cookies, chatUser: ChatUserResponseDto) {
	// TODO: Take chat user dto as argument
	cookies.set(COOKIE_KEY_CHAT_USER, chatUser.id, DEFAULT_COOKIES_OPT);
	cookies.set(COOKIE_KEY_API_USER, chatUser.apiUser, DEFAULT_COOKIES_OPT);
	cookies.set(COOKIE_KEY_CHAT_NAME, chatUser.name, DEFAULT_COOKIES_OPT);
}

export function resetChatCookies(cookies: Cookies) {
	cookies.set(COOKIE_KEY_CHAT_USER, '', DEFAULT_COOKIES_OPT);
	cookies.set(COOKIE_KEY_API_USER, '', DEFAULT_COOKIES_OPT);
	cookies.set(COOKIE_KEY_CHAT_NAME, '', DEFAULT_COOKIES_OPT);
}

export function loadChatCookies(cookies: Cookies): [boolean, ChatCookies] {
	const maybeChatUser = cookies.get(COOKIE_KEY_CHAT_USER);
	const maybeApiUser = cookies.get(COOKIE_KEY_API_USER);
	const maybeChatName = cookies.get(COOKIE_KEY_CHAT_NAME);

	const validChatUser = maybeChatUser !== undefined && maybeChatUser !== '';
	const validApiUser = maybeApiUser !== undefined && maybeApiUser !== '';
	const validChatName = maybeChatName !== undefined && maybeChatName !== '';
	const valid = validChatUser && validApiUser && validChatName;

	const out: ChatCookies = {
		chatUser: validOrEmptyString(maybeChatUser, validChatUser),
		apiUser: validOrEmptyString(maybeApiUser, validApiUser),
		chatName: validOrEmptyString(maybeChatName, validChatName)
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
