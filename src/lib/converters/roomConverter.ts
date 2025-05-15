import type { RoomResponseDto } from '$lib/communication/api/roomResponseDto';
import type { RoomUiDto } from '$lib/communication/ui/roomUiDto';
import { formatDate } from '$lib/time';

export function roomResponseDtoToRoomUiDto(apiDto: RoomResponseDto, selected: boolean): RoomUiDto {
	return {
		id: apiDto.id,
		name: apiDto.name,
		createdAt: formatDate(apiDto.createdAt),
		selected: selected,
		unreadMessages: 0
	};
}
