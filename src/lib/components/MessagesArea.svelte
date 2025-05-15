<script lang="ts">
	import { type MessageUiDto } from '$lib/communication/ui/messageUiDto';
	import { StyledText } from '@totocorpsoftwareinc/frontend-toolkit';
	import { tick } from 'svelte';

	interface Props {
		messages: MessageUiDto[];
		chatUserId: string;
	}

	let props: Props = $props();

	// https://svelte.dev/docs/svelte/bind#bind:this
	let messageArea: HTMLDivElement;

	const bgColorUserMessage = 'bg-secondary rounded-tr-none text-white';
	const bgColorOtherMessage = 'bg-primary-hover rounded-tl-none';

	let firstScroll = true;

	// https://svelte.dev/playground/937a3a035a1f41178714cd7e2e21ca7a?version=5.28.2
	$effect.pre(() => {
		// https://svelte.dev/docs/svelte/lifecycle-hooks#Deprecated:-beforeUpdate-afterUpdate-Chat-window-example
		// https://stackoverflow.com/questions/27732209/turning-off-eslint-rule-for-a-specific-line
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		props.messages;

		if (!messageArea) {
			return;
		}

		const thresholdForAreaBottomInPixels = 50;

		const limitToBeAtTheBottom = messageArea.scrollHeight - thresholdForAreaBottomInPixels;
		const currentBottomPosition = messageArea.offsetHeight + messageArea.scrollTop;

		const autoscroll = currentBottomPosition > limitToBeAtTheBottom;

		if (autoscroll) {
			// TODO: Maybe make the behavior instant if the scroll is too big.
			tick().then(() => {
				messageArea.scroll({ top: messageArea.scrollHeight, behavior: 'smooth' });
			});
		}
	});

	$effect(() => {
		if (!messageArea) {
			return;
		}

		if (firstScroll) {
			firstScroll = false;
			tick().then(() => {
				messageArea.scroll({ top: messageArea.scrollHeight, behavior: 'instant' });
			});
		}
	});
</script>

<div bind:this={messageArea} class="flex-1 flex-col-reverse space-y-4 overflow-y-auto p-4">
	{#each props.messages as message (message.id)}
		<div class="flex flex-col {message.userId === props.chatUserId ? 'items-end' : 'items-start'}">
			<div
				class="max-w-[70%] rounded-lg px-4 py-2 {message.userId === props.chatUserId
					? bgColorUserMessage
					: bgColorOtherMessage}"
			>
				{#if message.userId !== props.chatUserId}
					<StyledText
						text={message.user}
						textColor="text-secondary-hover"
						styling="text-sm font-semibold"
					/>
				{/if}
				<!-- https://stackoverflow.com/questions/19038070/html-newline-char-in-div-content-editable -->
				<!-- https://developer.mozilla.org/en-US/docs/Web/CSS/white-space#pre-wrap -->
				<div class="whitespace-pre-wrap">{message.message}</div>
				<StyledText
					text={message.createdAt}
					textColor="text-black"
					styling="mt-1 text-right text-xs opacity-70"
				/>
			</div>
		</div>
	{/each}
</div>
