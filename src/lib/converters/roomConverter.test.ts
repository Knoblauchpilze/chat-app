import { RoomResponseDto } from '$lib/communication/api/roomResponseDto';
import { describe, expect, it } from 'vitest';
import { roomResponseDtoToRoomUiDto } from '$lib/converters/roomConverter';

const SAMPLE_ROOM_RESPONSE = {
	id: 'ce353141-9b9c-4373-b9a5-861c8cb1f435',
	name: 'thebestroom',
	created_at: '2025-01-06T14:56:33.717344+00:00'
};

describe.concurrent('Converting API response to UI DTO', () => {
	it('should preserve identifier', () => {
		const inputDto = new RoomResponseDto(SAMPLE_ROOM_RESPONSE);
		const actual = roomResponseDtoToRoomUiDto(inputDto, false);
		expect(actual.id).toBe(SAMPLE_ROOM_RESPONSE.id);
	});

	it('should preserve name', () => {
		const inputDto = new RoomResponseDto(SAMPLE_ROOM_RESPONSE);
		const actual = roomResponseDtoToRoomUiDto(inputDto, false);
		expect(actual.name).toBe(SAMPLE_ROOM_RESPONSE.name);
	});

	it('should preserve creation date', () => {
		const inputDto = new RoomResponseDto(SAMPLE_ROOM_RESPONSE);
		const actual = roomResponseDtoToRoomUiDto(inputDto, false);
		expect(actual.createdAt).toBe('January 6, 2025 at 14:56:33');
	});

	it('respects selected status', () => {
		const inputDto = new RoomResponseDto(SAMPLE_ROOM_RESPONSE);
		let actual = roomResponseDtoToRoomUiDto(inputDto, false);
		expect(actual.selected).toBe(false);

		actual = roomResponseDtoToRoomUiDto(inputDto, true);
		expect(actual.selected).toBe(true);
	});

	it('should assign 0 unread messages', () => {
		const inputDto = new RoomResponseDto(SAMPLE_ROOM_RESPONSE);
		const actual = roomResponseDtoToRoomUiDto(inputDto, false);
		expect(actual.unreadMessages).toBe(0);
	});
});
