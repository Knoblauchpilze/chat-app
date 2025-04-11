import { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto';
import { describe, expect, it } from 'vitest';
import { chatUserResponseDtoToChatUserUiDto } from './chatUserConverter';

const SAMPLE_CHAT_USER_RESPONSE = {
	id: 'e6e68c94-8ff6-483a-94bf-95aecaf2aab2',
	name: 'thebestuser',
	api_user: '35f1481d-b499-4f28-8dae-8fcf5358634e',
	created_at: '2025-01-05T14:56:32.717344+00:00'
};

describe.concurrent('Converting API response to UI DTO', () => {
	it('should preserve user ID', () => {
		const inputDto = new ChatUserResponseDto(SAMPLE_CHAT_USER_RESPONSE);
		const actual = chatUserResponseDtoToChatUserUiDto(inputDto);
		expect(actual.id).toBe(SAMPLE_CHAT_USER_RESPONSE.id);
	});

	it('should preserve user email', () => {
		const inputDto = new ChatUserResponseDto(SAMPLE_CHAT_USER_RESPONSE);
		const actual = chatUserResponseDtoToChatUserUiDto(inputDto);
		expect(actual.name).toBe(SAMPLE_CHAT_USER_RESPONSE.name);
	});

	it('should preserve user password', () => {
		const inputDto = new ChatUserResponseDto(SAMPLE_CHAT_USER_RESPONSE);
		const actual = chatUserResponseDtoToChatUserUiDto(inputDto);
		expect(actual.apiUser).toBe(SAMPLE_CHAT_USER_RESPONSE.api_user);
	});

	it('should preserve creation date', () => {
		const inputDto = new ChatUserResponseDto(SAMPLE_CHAT_USER_RESPONSE);
		const actual = chatUserResponseDtoToChatUserUiDto(inputDto);
		expect(actual.createdAt).toBe('January 5, 2025 at 14:56:32');
	});
});
