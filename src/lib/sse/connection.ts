import { MessageResponseDto } from '$lib/communication/api/messageResponseDto';
import { buildApiUrl } from '$lib/rest/api';

export interface ConnectionProps {
	onConnected: () => void;
	onMessageReceived: (msg: MessageResponseDto) => void;
	onDisconnected: () => void;
}

export interface Connection {
	source: EventSource;
}

export function connectToServer(userId: string, props: ConnectionProps): Connection {
	const url = buildApiUrl('users/' + userId + '/subscribe');

	const source = new EventSource(url);

	source.onopen = () => {
		props.onConnected();
	};

	source.onerror = () => {
		props.onDisconnected();
	};

	source.onmessage = (event) => {
		const rawMsg = JSON.parse(event.data);
		const msg = new MessageResponseDto(rawMsg);
		props.onMessageReceived(msg);
	};

	return {
		source: source
	};
}
