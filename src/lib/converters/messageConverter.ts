import type { ChatUserResponseDto } from '$lib/communication/api/chatUserResponseDto';
import type { MessageResponseDto } from '$lib/communication/api/messageResponseDto';
import type { MessageUiDto } from '$lib/communication/ui/messageUiDto';
import { formatDate } from '$lib/time';

export function messageResponseDtoToMessageUiDto(
	apiDto: MessageResponseDto,
	users: ChatUserResponseDto[]
): MessageUiDto {
	const maybeUser = users.find((user) => user.id === apiDto.user);

	return {
		id: apiDto.id,
		userId: apiDto.user,
		user: maybeUser?.name ?? 'Ghost',
		room: apiDto.room,
		message: apiDto.message,
		createdAt: formatDate(apiDto.createdAt)
	};
}
