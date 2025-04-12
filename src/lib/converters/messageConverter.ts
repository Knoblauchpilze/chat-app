import type { MessageResponseDto } from '$lib/communication/api/messageResponseDto';
import type { MessageUiDto } from '$lib/communication/ui/messageUiDto';
import { formatDate } from '$lib/time';

export function messageResponseDtoToMessageUiDto(apiDto: MessageResponseDto): MessageUiDto {
	return {
		id: apiDto.id,
		user: apiDto.user,
		room: apiDto.room,
		message: apiDto.message,
		createdAt: formatDate(apiDto.createdAt)
	};
}
