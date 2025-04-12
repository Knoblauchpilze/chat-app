export class MessageResponseDto {
	readonly id: string = '00000000-0000-0000-0000-000000000000';
	readonly user: string = '00000000-0000-0000-0000-000000000000';
	readonly room: string = '00000000-0000-0000-0000-000000000000';
	readonly message: string = '';
	readonly createdAt: Date = new Date();

	constructor(data: object) {
		if ('id' in data && typeof data.id === 'string') {
			this.id = data.id;
		}

		if ('user' in data && typeof data.user === 'string') {
			this.user = data.user;
		}

		if ('room' in data && typeof data.room === 'string') {
			this.room = data.room;
		}

		if ('message' in data && typeof data.message === 'string') {
			this.message = data.message;
		}

		if ('created_at' in data && typeof data.created_at === 'string') {
			this.createdAt = new Date(data.created_at);
		}
	}
}
