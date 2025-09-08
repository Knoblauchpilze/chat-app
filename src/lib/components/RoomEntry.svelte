<script lang="ts">
	import { resolve } from '$app/paths';
	import type { RoomUiProps } from '$lib/communication/ui/roomUiProps';
	import type { RoomUiDto } from '$lib/communication/ui/roomUiDto';
	import { CloseSign } from '$lib/components';

	interface Props {
		selected: boolean;
		roomProps: RoomUiProps;
		room: RoomUiDto;
	}

	let { selected, roomProps, room }: Props = $props();

	const roomStyle = 'text-secondary flex w-full items-center justify-between rounded p-2 text-left';
	const backgroundStyle = $derived(selected ? 'bg-primary-hover' : 'hover:bg-primary-hover');
</script>

<div class="flex items-center">
	<a class="{roomStyle} {backgroundStyle}" href={resolve('/chats/rooms/[room]', { room: room.id })}>
		{#if !roomProps || roomProps.unreadMessages == 0}
			<span>{room.name}</span>
		{:else}
			<span class="font-bold">{room.name}</span>
			<span class="bg-secondary ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium text-white">
				{roomProps.unreadMessages}
			</span>
		{/if}
	</a>
	{#if room.name !== 'general'}
		<form method="POST" action="?/leaveRoom" class="absolute right-2 hidden group-hover:block">
			<input type="hidden" id="roomId" name="roomId" value={room.id} />
			<button
				type="submit"
				class="text-secondary-hover p-1 hover:text-red-500"
				aria-label="Leave room"
			>
				<CloseSign />
			</button>
		</form>
	{/if}
</div>
