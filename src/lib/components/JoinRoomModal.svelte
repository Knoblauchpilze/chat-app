<script lang="ts">
	import type { RoomUiDto } from '$lib/communication/ui/roomUiDto';
	import { StyledButton, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';
	import { CloseSign, SearchIcon, TickedSign } from '$lib/components';

	interface Props {
		rooms: RoomUiDto[];
		onClose: () => void;
	}

	let { rooms, onClose }: Props = $props();

	let searchTerm = $state('');
	let selectedRoomId: string | null = $state(null);

	let filteredRooms = $derived(
		rooms
			.filter((room) => room.name.toLowerCase().includes(searchTerm.toLowerCase()))
			.sort((a, b) => a.name.localeCompare(b.name))
	);

	function selectRoom(roomId: string) {
		selectedRoomId = roomId === selectedRoomId ? null : roomId;
	}

	function handleClose() {
		resetModal();
		onClose();
	}

	function handleCloseFromKeyboard(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}

	function resetModal() {
		searchTerm = '';
		selectedRoomId = null;
	}

	$effect(() => {
		resetModal();
	});
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
	<div
		class="bg-opacity-40 absolute inset-0 backdrop-blur-sm"
		onclick={handleClose}
		onkeydown={handleCloseFromKeyboard}
		role="button"
		tabindex="0"
		aria-label="Close modal"
	></div>

	<div class="bg-primary relative w-full max-w-md overflow-hidden rounded-lg shadow-xl">
		<div class="border-primary-hover flex items-center justify-between border-b p-4">
			<StyledTitle text="Join a Room" />
			<!-- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label -->
			<button
				onclick={handleClose}
				aria-label="close modal"
				class="text-secondary-hover hover:bg-primary-hover rounded-full p-1 focus:outline-none"
			>
				<CloseSign />
			</button>
		</div>

		<div class="bg-primary-selected p-4">
			<div class="mb-4">
				<div class="relative">
					<input
						type="text"
						bind:value={searchTerm}
						placeholder="Search rooms..."
						class="border-primary-hover focus:border-secondary w-full rounded border bg-white p-3 pl-10 focus:outline-none"
					/>
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<SearchIcon />
					</div>
				</div>
			</div>

			<div class="border-primary-hover bg-primary mb-4 max-h-60 overflow-y-auto rounded border">
				{#if filteredRooms.length === 0}
					<div class="text-secondary-hover py-6 text-center">No rooms match you search</div>
				{:else}
					<ul class="divide-primary-hover divide-y">
						{#each filteredRooms as room (room.id)}
							<li>
								<button
									onclick={() => selectRoom(room.id)}
									class="hover:bg-primary-hover w-full p-3 text-left {selectedRoomId === room.id
										? 'bg-primary-selected'
										: ''}"
								>
									<div class="flex items-center">
										<div class="flex-1">
											<div class="text-secondary">{room.name}</div>
										</div>
										{#if selectedRoomId === room.id}
											<TickedSign color="text-secondary" />
										{/if}
									</div>
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<div class="flex justify-end pt-3">
				<button
					onclick={handleClose}
					class="border-primary-hover bg-primary text-secondary hover:bg-primary-hover mr-2 rounded border px-4 py-2 font-medium"
				>
					Cancel
				</button>

				<form method="POST" action="?/joinRoom">
					<input class="hidden" id="room" name="room" value={selectedRoomId} />
					<StyledButton text="Join Room" styling="px-4 py-2" enabled={selectedRoomId !== null} />
				</form>
			</div>
		</div>
	</div>
</div>
