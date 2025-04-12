import { MessageResponseDto } from '$lib/communication/api/messageResponseDto';
import { describe, expect, it } from 'vitest';
import { messageResponseDtoToMessageUiDto } from '$lib/converters/messageConverter';

const SAMPLE_MESSAGE_RESPONSE = {
	id: 'fa5e2b80-1c1e-417a-8195-21cb5c60c4ae',
	user: '0198ed26-8e92-4b81-aec0-aaaff33b6a11',
	room: 'ef3cc94b-5142-4399-a366-70645a504219',
	message: 'This is empty here',
	created_at: '2025-04-06T18:50:40.525234Z'
};

describe.concurrent('Converting API response to UI DTO', () => {
	it('should preserve identifier', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto);
		expect(actual.id).toBe(SAMPLE_MESSAGE_RESPONSE.id);
	});

	it('should preserve user', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto);
		expect(actual.user).toBe(SAMPLE_MESSAGE_RESPONSE.user);
	});

	it('should preserve room', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto);
		expect(actual.room).toBe(SAMPLE_MESSAGE_RESPONSE.room);
	});

	it('should preserve message', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto);
		expect(actual.message).toBe(SAMPLE_MESSAGE_RESPONSE.message);
	});

	it('should preserve creation date', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto);
		expect(actual.createdAt).toBe('April 6, 2025 at 18:50:40');
	});
});
