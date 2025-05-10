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

const SAMPLE_USERS = [
	{
		id: '0198ed26-8e92-4b81-aec0-aaaff33b6a11',
		name: 'user1',
		apiUser: '0463ed3d-bfc9-4c10-b6ee-c223bbca0fab',
		createdAt: new Date('2025-04-13T14:14:30.931313Z')
	}
];

describe.concurrent('Converting API response to UI DTO', () => {
	it('should preserve identifier', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto, SAMPLE_USERS);
		expect(actual.id).toBe(SAMPLE_MESSAGE_RESPONSE.id);
	});

	it('should preserve user id', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto, SAMPLE_USERS);
		expect(actual.userId).toBe(SAMPLE_MESSAGE_RESPONSE.user);
	});

	it('should assign user name from users DTOs', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto, SAMPLE_USERS);
		expect(actual.user).toBe('user1');
	});

	it('should preserve room', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto, SAMPLE_USERS);
		expect(actual.room).toBe(SAMPLE_MESSAGE_RESPONSE.room);
	});

	it('should preserve message', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto, SAMPLE_USERS);
		expect(actual.message).toBe(SAMPLE_MESSAGE_RESPONSE.message);
	});

	it('should preserve creation date', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto, SAMPLE_USERS);
		expect(actual.createdAt).toBe('April 6, 2025 at 18:50:40');
	});

	it('should assign default name when user cannot be matched with known users', () => {
		const inputDto = new MessageResponseDto(SAMPLE_MESSAGE_RESPONSE);
		const actual = messageResponseDtoToMessageUiDto(inputDto, []);
		expect(actual.user).toBe('Ghost');
	});
});
