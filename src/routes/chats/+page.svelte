<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import {
		FlexContainer,
		StyledError,
		StyledLink,
		StyledText,
		StyledTitle
	} from '@totocorpsoftwareinc/frontend-toolkit';

	import { tcpConnection } from '$lib/stores/connection';

	const UPDATE_INTERVAL_MS = 500;
	// https://stackoverflow.com/questions/51040703/what-return-type-should-be-used-for-settimeout-in-typescript
	let timeoutId: ReturnType<typeof setTimeout>;
	let dots = $state('');

	onMount(() => {
		timeoutId = setInterval(() => {
			dots += '.';
			if (dots.length > 3) {
				dots = '';
			}
		}, UPDATE_INTERVAL_MS);
	});

	onDestroy(() => {
		clearInterval(timeoutId);
	});

	// https://svelte.dev/playground/545e4431b32b41cdaa468ea9613281f3?version=5.16.0
</script>

<FlexContainer
	justify="center"
	align="center"
	bgColor="bg-primary-selected"
	styling="h-screen w-full"
>
	<FlexContainer
		bgColor="bg-primary"
		extensible={false}
		styling="w-full max-w-md rounded-lg p-8 shadow-lg"
	>
		<StyledTitle text="Loading messages" />

		{#await $tcpConnection.socket}
			<StyledText text="Connecting{dots}" />"
		{:then socket}
			{#if socket === undefined}
				<StyledText text="Connecting{dots}" />"
				<StyledError text="Something does not seem right:" />
				<StyledError text={$tcpConnection.errorMessage} />
			{:else}
				<StyledText text="Connected!" />
			{/if}
		{:catch error}
			<StyledError text="Something does not seem right:" />
			<StyledError text={error} />

			<StyledLink text="Back to home page" link="/" showAsButton={true} />
		{/await}
	</FlexContainer>
</FlexContainer>
