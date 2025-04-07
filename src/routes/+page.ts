// https://www.reddit.com/r/sveltejs/comments/13shebb/how_can_i_use_both_pagets_and_pageserverts/

import { redirect } from '@sveltejs/kit';
import { HttpStatus } from '@totocorpsoftwareinc/frontend-toolkit';

// https://svelte.dev/docs/kit/load#Universal-vs-server-When-to-use-which
export async function load({ data }) {
	if (data.registered) {
		redirect(HttpStatus.SEE_OTHER, '/chats');
	}

	return data;
}
