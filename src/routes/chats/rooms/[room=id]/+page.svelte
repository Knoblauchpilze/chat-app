<script lang="ts">
	import { onMount } from 'svelte';
	import { StyledButton, StyledText, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';
	import { connectToServer } from '$lib/tcp/connect';

	let { data } = $props();

	// https://stackoverflow.com/questions/69151604/how-to-access-websocket-in-svelte
	onMount(() => async () => {
		// https://stackoverflow.com/questions/74457685/how-do-i-use-net-module-node-js-tcp-client-in-html-browser
		const props = {
			clientId: data.user.id
		};
		const socket = await connectToServer(props);
		socket.close();
	});

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

		<div class="p-2">
			<StyledText text="Rooms" styling="text-secondary text-sm font-semibold mb-2" />
			<ul>
				{#each data.rooms as room (room.id)}
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
	</div>

	<!-- Main chat area -->
	<div class="bg-primary-selected flex flex-1 flex-col">
		<!-- Chat header -->
		<div class="border-primary-hover bg-primary flex items-center border-b p-4">
			<StyledTitle text="General" textSize="text-lg" />
		</div>

		<!-- Messages area -->
		<div class="flex-1 space-y-4 overflow-y-auto p-4">
			{#each data.messages as message (message.id)}
				<div class="flex flex-col {message.user === data.user.id ? 'items-end' : 'items-start'}">
					<div
						class="max-w-[70%] rounded-lg px-4 py-2 {message.user === data.user.id
							? 'bg-secondary rounded-tr-none text-white'
							: 'bg-primary-hover rounded-tl-none'}"
					>
						{#if message.user !== data.user.id}
							<div class="text-secondary-hover text-sm font-semibold">{message.user}</div>
						{/if}
						<div>{message.message}</div>
						<div class="mt-1 text-right text-xs opacity-70">{message.createdAt}</div>
					</div>
				</div>
			{/each}
		</div>

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
