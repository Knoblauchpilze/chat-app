export class ChatUserResponseDto {
	readonly id: string = '00000000-0000-0000-0000-000000000000';
	readonly name: string = '';
	readonly apiUser: string = '00000000-0000-0000-0000-000000000000';
	readonly createdAt: Date = new Date();

	constructor(data: object) {
		// https://stackoverflow.com/questions/43894565/cast-object-to-interface-in-typescript
		if ('id' in data && typeof data.id === 'string') {
			this.id = data.id;
		}

		if ('name' in data && typeof data.name === 'string') {
			this.name = data.name;
		}

		if ('api_user' in data && typeof data.api_user === 'string') {
			this.apiUser = data.api_user;
		}

		// https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
		if ('created_at' in data && typeof data.created_at === 'string') {
			this.createdAt = new Date(data.created_at);
		}
	}
}
