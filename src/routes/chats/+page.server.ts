import { loadCookiesOrRedirectToLogin } from '$lib/cookies.js';

export async function load({ cookies }) {
	const chatCookies = loadCookiesOrRedirectToLogin(cookies);

	return {
		name: chatCookies.chatName
	};
}
