<script lang="ts">
	import { StyledButton, StyledText, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';

	let { data } = $props();

	const messages = [
		{ id: '1', sender: 'Alice', content: 'Hey there!', timestamp: '10:30 AM' },
		{ id: '2', sender: 'Bob', content: 'How are you doing?', timestamp: '10:32 AM' },
		{ id: '3', sender: 'Rando', content: "I'm great, thanks for asking!", timestamp: '10:34 AM' },
		{ id: '4', sender: 'Alice', content: 'What are you working on?', timestamp: '10:36 AM' },
		{
			id: '5',
			sender: 'Bob',
			content: 'Just the usual stuff. How about you?',
			timestamp: '10:38 AM'
		}
	];

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
						<button
							class="hover:bg-primary-hover text-secondary flex w-full items-center justify-between rounded p-2 text-left"
						>
							<span>{room.name}</span>
						</button>
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
			{#each messages as message (message.id)}
				<div
					class="flex flex-col {message.sender === data.user.name ? 'items-end' : 'items-start'}"
				>
					<div
						class="max-w-[70%] rounded-lg px-4 py-2 {message.sender === data.user.name
							? 'bg-secondary rounded-tr-none text-white'
							: 'bg-primary-hover rounded-tl-none'}"
					>
						{#if message.sender !== data.user.name}
							<div class="text-secondary-hover text-sm font-semibold">{message.sender}</div>
						{/if}
						<div>{message.content}</div>
						<div class="mt-1 text-right text-xs opacity-70">{message.timestamp}</div>
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
