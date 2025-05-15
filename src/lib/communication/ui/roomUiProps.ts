import type { RoomUiDto } from '$lib/communication/ui/roomUiDto';

export interface RoomUiProps {
	room: RoomUiDto;
	unreadMessages: number;
}
