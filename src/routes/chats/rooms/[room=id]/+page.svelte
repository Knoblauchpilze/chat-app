<script lang="ts">
	import { StyledButton, StyledText, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';
	import { MessagesArea, MessageInput, RoomsList } from '$lib/components';
	import { onMount } from 'svelte';
	import { connectToServer } from '$lib/sse/connection';
	import type { MessageResponseDto } from '$lib/communication/api/messageResponseDto';
	import { sendMessage } from '$lib/services/messages';
	import { getErrorMessageFromApiResponse } from '$lib/rest/api';
	import { messageResponseDtoToMessageUiDtoFromUiUser } from '$lib/converters/messageConverter';
	import type { RoomUiProps } from '$lib/communication/ui/roomUiProps';

	let { data } = $props();

	const STATUS_TEXT_COLORS = {
		CONNECTED: 'text-green-500',
		CONNECTING: 'text-yellow-500',
		DISCONNECTED: 'text-red-500',
		ERROR: 'text-orange-500'
	};

	let statusMessage: string = $state('connecting...');
	let statusTextColor: string = $state(STATUS_TEXT_COLORS.CONNECTING);

	let messages = $derived(data.messages);

	let rooms: RoomUiProps[] = $state(
		data.rooms.map((room) => {
			return { room: room, unreadMessages: 0 };
		})
	);

	// https://stackoverflow.com/questions/64921224/how-to-run-server-sent-events-in-svelte-component-in-sapper
	onMount(() => {
		const props = {
			onConnected: () => {
				statusTextColor = STATUS_TEXT_COLORS.CONNECTED;
				statusMessage = 'connected';
			},
			onMessageReceived: (inMsg: MessageResponseDto) => {
				if (inMsg.room !== data.room) {
					const id = rooms.findIndex((room) => room.room.id === inMsg.room);
					if (id !== -1) {
						rooms[id].unreadMessages++;
					}

					return;
				}

				const msg = messageResponseDtoToMessageUiDtoFromUiUser(inMsg, data.users);
				messages = [...messages, msg];
			},
			onDisconnected: () => {
				statusTextColor = STATUS_TEXT_COLORS.DISCONNECTED;
				statusMessage = "couldn't connect to server";
			}
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
			if (response.is2xxOk()) {
				statusTextColor = STATUS_TEXT_COLORS.CONNECTED;
				statusMessage = 'connected';
			} else {
				statusTextColor = STATUS_TEXT_COLORS.ERROR;
				statusMessage = getErrorMessageFromApiResponse(response);
			}
		});
		return true;
	}
</script>

<div class="flex h-screen w-full overflow-hidden">
	<!-- Sidebar with rooms -->
	<div class="bg-primary border-primary-hover w-64 overflow-y-auto border-r">
		<div class="border-primary-hover border-b p-4">
			{#each rooms as pp}
				<p class="text-white">{pp.unreadMessages}</p>
			{/each}
			<StyledTitle text="Chatterly" textSize="text-xl" />
			<div class="mt-2 flex items-center justify-between">
				<StyledText text={`Hello, ${data.user.name}`} styling="text-sm" />
				<form method="POST" action="?/logout" class="inline">
					<StyledButton text="Logout" styling="text-xs py-1 px-2" />
				</form>
			</div>
		</div>

		<RoomsList currentRoom={data.room} {rooms} />
	</div>

	<!-- Main chat area -->
	<div class="bg-primary-selected flex flex-1 flex-col">
		<!-- Chat header -->
		<div class="border-primary-hover bg-primary flex items-center border-b p-4">
			<StyledTitle text="Generals" textSize="text-lg" />
		</div>

		<MessagesArea {messages} chatUserId={data.user.id} />
		<div class="bg-primary p-2 text-right text-sm">
			<p class={statusTextColor}>{statusMessage}</p>
		</div>
		<MessageInput {onMessageRequest} />
	</div>
</div>
