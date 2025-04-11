import type { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto';
import type { ChatUserUiDto } from '$lib/communication/ui/chatUserUiDto';
import { formatDate } from '$lib/time';

export function chatUserResponseDtoToChatUserUiDto(apiDto: ChatUserResponseDto): ChatUserUiDto {
	return {
		id: apiDto.id,
		name: apiDto.name,
		apiUser: apiDto.apiUser,
		createdAt: formatDate(apiDto.createdAt)
	};
}
