import { PUBLIC_TCP_API_HOST, PUBLIC_TCP_API_PORT } from '$env/static/public';

export interface ConnectionProps {
	host?: string;
	port?: number;
	clientId: string;
	connectionTimeoutMs?: number;
}

export function buildTcpUrl(props: ConnectionProps): string {
	const host = props.host ?? PUBLIC_TCP_API_HOST;
	const port = props.port ?? PUBLIC_TCP_API_PORT;

	return `ws://${host}:${port}/v1/chats/ws`;
}
