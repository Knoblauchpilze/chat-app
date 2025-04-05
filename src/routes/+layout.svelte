<script lang="ts">
	import '$styles/app.css';
	import { type Snippet } from 'svelte';

	import pageTitle from '$lib/stores/ui/pageTitle';
	import heroContainer from '$lib/stores/ui/heroContainer';

	import { HeroContainer } from '@totocorpsoftwareinc/frontend-toolkit';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>{$pageTitle}</title>
</svelte:head>
<HeroContainer
	width={$heroContainer.width}
	height={$heroContainer.height}
	bgColor={$heroContainer.color}
	bgOverlay="bg-transparent"
>
	{@render children?.()}
</HeroContainer>
