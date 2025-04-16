// https://vitest.dev/config/#setupfiles
import { WebSocket } from 'ws';

global.WebSocket = WebSocket;
