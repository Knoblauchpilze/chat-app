<script lang="ts">
	import { StyledText } from '@totocorpsoftwareinc/frontend-toolkit';
	import type { RoomUiProps } from '$lib/communication/ui/roomUiProps';
	import type { RoomUiDto } from '$lib/communication/ui/roomUiDto';
	import { JoinRoomModal, RoomEntry } from '$lib/components';

	interface Props {
		currentRoom: string;
		userRooms: RoomUiDto[];
		userRoomProps: RoomUiProps[];
		rooms: RoomUiDto[];
	}

	let { currentRoom, userRooms, userRoomProps, rooms }: Props = $props();
	let showJoinRoomModal: boolean = $state(false);

	let unread = $derived.by(() => {
		return userRooms.map((room) => {
			const prop = userRoomProps.find((prop) => prop.room === room.id);
			if (prop === undefined) {
				return {
					room: room.id,
					unreadMessages: 0
				};
			} else {
				return {
					room: room.id,
					unreadMessages: prop.unreadMessages
				};
			}
		});
	});

	function toggleJoinRoomModal() {
		showJoinRoomModal = !showJoinRoomModal;
	}
</script>

<div class="flex flex-grow flex-col justify-between p-2">
	<div>
		<StyledText text="Rooms" styling="text-secondary text-sm font-semibold mb-2" />
		<ul>
			{#each userRooms as room, id (room.id)}
				<li class="group relative mb-1">
					<RoomEntry {room} roomProps={unread[id]} selected={room.id === currentRoom} />
				</li>
			{/each}
		</ul>
	</div>

	<button
		class="bg-secondary hover:bg-secondary-hover rounded-md px-4 py-2 text-sm font-medium text-white"
		onclick={toggleJoinRoomModal}>Join a new room...</button
	>
</div>

{#if showJoinRoomModal}
	<JoinRoomModal {rooms} onClose={toggleJoinRoomModal} />
{/if}
