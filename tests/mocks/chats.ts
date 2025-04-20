import { ws } from 'msw';
import { TEST_SERVER_HOST, TEST_SERVER_PORT } from '$tests/mocks/constants';

const url = `ws://${TEST_SERVER_HOST}:${TEST_SERVER_PORT}/v1/chats/ws`;

export const chats = ws.link(url);
