// https://www.reddit.com/r/sveltejs/comments/13shebb/how_can_i_use_both_pagets_and_pageserverts/

import { error, redirect } from '@sveltejs/kit';
import { HttpStatus } from '@totocorpsoftwareinc/frontend-toolkit';

// https://svelte.dev/docs/kit/load#Universal-vs-server-When-to-use-which
export async function load({ data }) {
	if (data.registered) {
		if (data.rooms.length > 0) {
			redirect(HttpStatus.SEE_OTHER, '/chats/rooms/' + data.rooms[0].id);
		}

		error(HttpStatus.NOT_FOUND, 'You are not a member of any room!');
	}

	return data;
}
