<script lang="ts">
	import { StyledText } from '@totocorpsoftwareinc/frontend-toolkit';

	let form: HTMLFormElement;

	let newMessage = $state('');

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			if (newMessage.trim() !== '') {
				form.submit();
			}
		}
	}
</script>

<div class="border-primary-hover bg-primary border-t p-4">
	<div class="flex">
		<form bind:this={form} method="POST" action="?/send" class="flex w-full">
			<textarea
				id="message"
				name="message"
				placeholder="Type a message..."
				required
				bind:value={newMessage}
				onkeydown={handleKeyDown}
				class="border-primary-hover focus:border-secondary flex-1 resize-none rounded-l-md border bg-white p-2 focus:outline-none"
				rows="2"
			></textarea>
			{#if newMessage !== ''}
				<button class="bg-secondary hover:bg-secondary-hover h-auto rounded-r-md px-4 text-white">
					Send
				</button>
			{:else}
				<button disabled class="bg-secondary-hover h-auto rounded-r-md px-4 text-white">
					Send
				</button>
			{/if}
		</form>
	</div>
	<StyledText
		text="Press Enter to send, Shift+Enter for new line"
		textColor="text-gray-400"
		styling="mt-1 text-xs"
	/>
</div>
