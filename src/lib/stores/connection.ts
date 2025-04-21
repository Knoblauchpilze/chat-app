import { writable } from 'svelte/store';
import { Connection } from '$lib/tcp/connection';

// https://svelte.dev/docs/svelte/await
// https://svelte.dev/playground/29a5bdfb981f479fb387298aef1190a0?version=5.28.1
const props = {
	clientId: '3e7aff94-b750-4a40-8db5-1135af373a3b'
};
export const tcpConnection = writable<Connection>(new Connection(props));
