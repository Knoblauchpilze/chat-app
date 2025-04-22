export function analyzeCloseEvent(event: CloseEvent): Error | undefined {
	// https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
	switch (event.code) {
		case 1000:
			return undefined;
		case 1006:
			return new Error('server refused our connection');
		default:
			return new Error('unexpected close error: ' + event.code);
	}
}
