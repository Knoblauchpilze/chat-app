import { loadCookiesOrRedirectToLogin, resetChatCookies } from '$lib/cookies';
import { redirect } from '@sveltejs/kit';
import { HttpStatus } from '@totocorpsoftwareinc/frontend-toolkit';

export async function load({ cookies }) {
	const chatCookies = loadCookiesOrRedirectToLogin(cookies);

	return {
		name: chatCookies.chatName
	};
}

export const actions = {
	logout: async ({ cookies }) => {
		resetChatCookies(cookies);

		redirect(HttpStatus.SEE_OTHER, '/');
	}
};
