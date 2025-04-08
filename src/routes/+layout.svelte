<script lang="ts">
	import '$styles/app.css';
	import { type Snippet } from 'svelte';

	import pageTitle from '$lib/stores/ui/pageTitle';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>{$pageTitle}</title>
</svelte:head>
{@render children?.()}
