<script lang="ts">
	import { StyledButton, StyledText } from '@totocorpsoftwareinc/frontend-toolkit';
	import type { RoomUiProps } from '$lib/communication/ui/roomUiProps';
	import type { RoomUiDto } from '$lib/communication/ui/roomUiDto';

	interface Props {
		currentRoom: string;
		rooms: RoomUiDto[];
		roomProps: RoomUiProps[];
	}

	let { currentRoom, rooms, roomProps }: Props = $props();

	let unread = $derived.by(() => {
		return rooms.map((room) => {
			const prop = roomProps.find((prop) => prop.room === room.id);
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
</script>

<div class="flex flex-grow flex-col justify-between p-2">
	<div>
		<StyledText text="Rooms" styling="text-secondary text-sm font-semibold mb-2" />
		<ul>
			{#each rooms as room, id (room.id)}
				<li class="mb-1">
					{#if room.id === currentRoom}
						<a
							class="bg-primary-hover text-secondary flex w-full items-center justify-between rounded p-2 text-left"
							href={'/chats/rooms/' + room.id}
						>
							{room.name}
						</a>
					{:else}
						<a
							class="hover:bg-primary-hover text-secondary flex w-full items-center justify-between rounded p-2 text-left"
							href={'/chats/rooms/' + room.id}
						>
							{#if unread[id].unreadMessages == 0}
								<span>{room.name}</span>
							{:else}
								<span class="font-bold">{room.name}</span>
								<span
									class="bg-secondary ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium text-white"
								>
									{unread[id].unreadMessages}
								</span>
							{/if}
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</div>

	<button
		class="bg-secondary hover:bg-secondary-hover rounded-md px-4 py-2 text-sm font-medium text-white"
		>Join a new room...</button
	>
</div>
