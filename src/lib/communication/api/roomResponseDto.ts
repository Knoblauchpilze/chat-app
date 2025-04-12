export class RoomResponseDto {
	readonly id: string = '00000000-0000-0000-0000-000000000000';
	readonly name: string = '';
	readonly createdAt: Date = new Date();

	constructor(data: object) {
		if ('id' in data && typeof data.id === 'string') {
			this.id = data.id;
		}

		if ('name' in data && typeof data.name === 'string') {
			this.name = data.name;
		}

		if ('created_at' in data && typeof data.created_at === 'string') {
			this.createdAt = new Date(data.created_at);
		}
	}
}
