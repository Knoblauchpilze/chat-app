<script lang="ts">
	import { StyledText } from '@totocorpsoftwareinc/frontend-toolkit';
	import { type RoomUiDto } from '$lib/communication/ui/roomUiDto';

	interface Props {
		rooms: RoomUiDto[];
	}

	let props: Props = $props();
</script>

<div class="p-2">
	<StyledText text="Rooms" styling="text-secondary text-sm font-semibold mb-2" />
	<ul>
		{#each props.rooms as room (room.id)}
			<li class="mb-1">
				<a
					class="hover:bg-primary-hover text-secondary flex w-full items-center justify-between rounded p-2 text-left"
					href={'/chats/rooms/' + room.id}
				>
					{room.name}
				</a>
			</li>
		{/each}
	</ul>
</div>
