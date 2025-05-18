<script lang="ts">
	import type { RoomUiDto } from '$lib/communication/ui/roomUiDto';
	import { StyledButton, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';

	interface Props {
		rooms: RoomUiDto[];
		onClose: () => void;
		onJoin: (roomId: string) => void;
	}

	let { rooms, onClose, onJoin }: Props = $props();

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

	function handleJoin() {
		if (selectedRoomId) {
			onJoin(selectedRoomId);
			resetModal();
		}
	}

	function handleClose() {
		resetModal();
		onClose();
	}

	function resetModal() {
		searchTerm = '';
		selectedRoomId = null;
	}

	// Reset state when modal is opened
	$effect(() => {
		resetModal();
	});
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
	<!-- Semi-transparent backdrop that allows content to be visible -->
	<div class="bg-opacity-40 absolute inset-0 backdrop-blur-sm" onclick={handleClose}></div>

	<div class="bg-primary relative w-full max-w-md overflow-hidden rounded-lg shadow-xl">
		<div class="border-primary-hover flex items-center justify-between border-b p-4">
			<StyledTitle text="Join a Room" />
			<!-- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label -->
			<button
				onclick={handleClose}
				aria-label="close modal"
				class="text-secondary-hover hover:bg-primary-hover rounded-full p-1 focus:outline-none"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
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
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div class="border-primary-hover bg-primary mb-4 max-h-60 overflow-y-auto rounded border">
				{#if filteredRooms.length === 0}
					<div class="text-secondary-hover py-6 text-center">No rooms match your search</div>
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
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="text-secondary h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
													clip-rule="evenodd"
												/>
											</svg>
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
				<StyledButton
					text="Join Room"
					styling="px-4 py-2"
					enabled={selectedRoomId !== null}
					onClick={handleJoin}
				/>
			</div>
		</div>
	</div>
</div>
