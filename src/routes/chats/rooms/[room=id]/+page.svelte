<script lang="ts">
	import { StyledButton, StyledText, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';
	import { MessagesArea, MessageInput, RoomsList } from '$lib/components';
	import { onDestroy, onMount } from 'svelte';
	import { ConnectionState } from '$lib/sse/state';

	let { data } = $props();

	const url = 'http://localhost:60001/v1/chats/users/' + data.user.id + '/subscribe';

	let connectionState: ConnectionState = $state(ConnectionState.CONNECTING);

	let source: EventSource;

	// https://stackoverflow.com/questions/64921224/how-to-run-server-sent-events-in-svelte-component-in-sapper
	// TODO: The documentation says this does not need to live inside the component
	onMount(() => {
		source = new EventSource(url);

		source.onopen = () => {
			connectionState = ConnectionState.CONNECTED;
		};

		source.onerror = () => {
			connectionState = ConnectionState.DISCONNECTED;
		};

		source.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log('message received', message);
			data.messages.push(message);
		};

		// https://stackoverflow.com/questions/61058835/close-an-event-source-sse-on-page-reload
		window.onbeforeunload = () => {
			source.close();
		};

		// https://svelte.dev/docs/svelte/lifecycle-hooks
		return () => {
			source.close();
		};
	});
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
			<StyledTitle text="Generals" textSize="text-lg" />
		</div>

		<MessagesArea messages={data.messages} chatUserId={data.user.id} />
		<div class="bg-primary p-2 text-sm">
			{#if connectionState === ConnectionState.CONNECTING}
				<p class="text-yellow-500">connecting...</p>
			{:else if connectionState === ConnectionState.CONNECTED}
				<p class="text-right text-green-500">connected</p>
			{:else}
				<p class="text-red-500">couldn't connect to server</p>
			{/if}
		</div>
		<MessageInput />
	</div>
</div>
