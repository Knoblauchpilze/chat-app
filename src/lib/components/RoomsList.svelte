<script lang="ts">
	import { StyledText } from '@totocorpsoftwareinc/frontend-toolkit';
	import type { RoomUiProps } from '$lib/communication/ui/roomUiProps';

	interface Props {
		currentRoom: string;
		rooms: RoomUiProps[];
	}

	let { currentRoom, rooms }: Props = $props();
</script>

<div class="p-2">
	<StyledText text="Rooms" styling="text-secondary text-sm font-semibold mb-2" />
	<ul>
		{#each rooms as room, id (room.room.id)}
			<li class="mb-1">
				{#if room.room.id === currentRoom}
					<a
						class="bg-primary-hover text-secondary flex w-full items-center justify-between rounded p-2 text-left"
						href={'/chats/rooms/' + room.room.id}
					>
						{room.room.name}
					</a>
				{:else}
					<a
						class="hover:bg-primary-hover text-secondary flex w-full items-center justify-between rounded p-2 text-left"
						href={'/chats/rooms/' + room.room.id}
					>
						{#if room.unreadMessages == 0}
							<span>{room.room.name}</span>
						{:else}
							<span class="font-bold">{room.room.name}</span>
							<span
								class="bg-secondary ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium text-white"
							>
								{room.unreadMessages}
							</span>
						{/if}
					</a>
				{/if}
			</li>
		{/each}
	</ul>
</div>
