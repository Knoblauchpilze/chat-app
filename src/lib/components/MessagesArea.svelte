<script lang="ts">
	import { type MessageUiDto } from '$lib/communication/ui/messageUiDto';
	import { StyledText } from '@totocorpsoftwareinc/frontend-toolkit';

	interface Props {
		messages: MessageUiDto[];
		chatUserId: string;
	}

	let props: Props = $props();

	const bgColorUserMessage = 'bg-secondary rounded-tr-none text-white';
	const bgColorOtherMessage = 'bg-primary-hover rounded-tl-none';
</script>

<div class="flex-1 space-y-4 overflow-y-auto p-4">
	{#each props.messages as message (message.id)}
		<div class="flex flex-col {message.user === props.chatUserId ? 'items-end' : 'items-start'}">
			<div
				class="max-w-[70%] rounded-lg px-4 py-2 {message.user === props.chatUserId
					? bgColorUserMessage
					: bgColorOtherMessage}"
			>
				{#if message.user !== props.chatUserId}
					<StyledText
						text={message.user}
						textColor="text-secondary-hover"
						styling="text-sm font-semibold"
					/>
				{/if}
				<div>{message.message}</div>
				<StyledText
					text={message.createdAt}
					textColor="text-black"
					styling="mt-1 text-right text-xs opacity-70"
				/>
			</div>
		</div>
	{/each}
</div>
