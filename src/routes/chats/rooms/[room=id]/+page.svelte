<script lang="ts">
	import { StyledButton, StyledText, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';
	import { MessagesArea, MessageInput, RoomsList } from '$lib/components';
	import { onMount } from 'svelte';
	import { ConnectionState } from '$lib/sse/state';
	import { connectToServer } from '$lib/sse/connection';
	import type { MessageResponseDto } from '$lib/communication/api/messageResponseDto';
	import { sendMessage } from '$lib/services/messages';

	let { data } = $props();

	let status: ConnectionState = $state(ConnectionState.CONNECTING);

	// https://stackoverflow.com/questions/64921224/how-to-run-server-sent-events-in-svelte-component-in-sapper
	onMount(() => {
		const props = {
			onConnected: () => (status = ConnectionState.CONNECTED),
			onMessageReceived: (msg: MessageResponseDto) => {
				console.log('received message', msg);
			},
			onDisconnected: () => (status = ConnectionState.DISCONNECTED)
		};

		const conn = connectToServer(data.user.id, props);

		// https://stackoverflow.com/questions/61058835/close-an-event-source-sse-on-page-reload
		window.onbeforeunload = () => {
			conn.source.close();
		};

		// https://svelte.dev/docs/svelte/lifecycle-hooks
		return () => {
			conn.source.close();
		};
	});

	function onMessageRequest(message: string): boolean {
		// Given the way the safeFetch is implemented in the frontend-toolkit,
		// we should always get a valid API response. It might be an error
		// response.
		sendMessage(data.user.id, data.room, message).then((response) => {
			console.log('response:', response);
		});
		return true;
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
			<StyledTitle text="Generals" textSize="text-lg" />
		</div>

		<MessagesArea messages={data.messages} chatUserId={data.user.id} />
		<div class="bg-primary p-2 text-right text-sm">
			{#if status === ConnectionState.CONNECTING}
				<p class="text-yellow-500">connecting...</p>
			{:else if status === ConnectionState.CONNECTED}
				<p class="text-green-500">connected</p>
			{:else}
				<p class="text-red-500">couldn't connect to server</p>
			{/if}
		</div>
		<MessageInput {onMessageRequest} />
	</div>
</div>
