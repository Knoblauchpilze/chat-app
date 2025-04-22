<script lang="ts">
	import { StyledText } from '@totocorpsoftwareinc/frontend-toolkit';

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
	<StyledText
		text="Press Enter to send, Shift+Enter for new line"
		textColor="text-gray-400"
		styling="mt-1 text-xs"
	/>
</div>
