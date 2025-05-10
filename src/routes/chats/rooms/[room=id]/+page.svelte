<script lang="ts">
	import { StyledButton, StyledText, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';
	import { MessagesArea, MessageInput, RoomsList } from '$lib/components';

	let { data } = $props();
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
		<div class="bg-primary p-2 text-sm">
			<!-- {#await connection}
				<p class="text-yellow-500">connecting...</p>
			{:then}
				<p class="text-right text-green-500">connected</p>
			{:catch error}
				<p class="text-red-500">couldn't connect to server: {error.message}</p>
			{/await} -->
		</div>
		<MessageInput />
	</div>
</div>
