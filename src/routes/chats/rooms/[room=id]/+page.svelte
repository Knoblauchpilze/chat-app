<script lang="ts">
	import { RoomsList } from '$lib/components';
	import MessagesArea from '$lib/components/MessagesArea.svelte';
	import { StyledButton, StyledText, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';

	let { data } = $props();

	let newMessage = $state('');

	function sendMessage() {
		if (newMessage.trim()) {
			// In a real app, you would send this to your backend
			console.log('Sending message:', newMessage);
			newMessage = '';
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

<div class="flex h-screen w-full overflow-hidden">
	<!-- Sidebar with rooms -->
	<div class="bg-primary border-primary-hover w-64 overflow-y-auto border-r">
		<div class="border-primary-hover border-b p-4">
			<StyledTitle text="Chatterly" textSize="text-xl" />
			<div class="mt-2 flex items-center justify-between">
				<StyledText text={`Hello, ${data.user.name}`} styling="text-sm" />
				<form method="POST" action="?/logout" class="inline">
					<StyledButton text="Logout" styling="text-xs py-1 px-2" />
				</form>
			</div>
		</div>

		<RoomsList rooms={data.rooms} />
	</div>

	<!-- Main chat area -->
	<div class="bg-primary-selected flex flex-1 flex-col">
		<!-- Chat header -->
		<div class="border-primary-hover bg-primary flex items-center border-b p-4">
			<StyledTitle text="General" textSize="text-lg" />
		</div>

		<MessagesArea messages={data.messages} chatUserId={data.user.id} />

		<!-- Message input -->
		<div class="border-primary-hover bg-primary border-t p-4">
			<div class="flex">
				<textarea
					bind:value={newMessage}
					onkeydown={handleKeyDown}
					placeholder="Type a message..."
					class="border-primary-hover focus:border-secondary flex-1 resize-none rounded-l-md border bg-white p-2 focus:outline-none"
					rows="2"
				></textarea>
				<button
					onclick={sendMessage}
					class="bg-secondary hover:bg-secondary-hover rounded-r-md px-4 text-white"
				>
					Send
				</button>
			</div>
			<div class="mt-1 text-xs text-gray-400">Press Enter to send, Shift+Enter for new line</div>
		</div>
	</div>
</div>
