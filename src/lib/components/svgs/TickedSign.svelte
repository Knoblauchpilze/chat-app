<script lang="ts">
	interface Props {
		color: string;
	}

	let { color }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class="{color} h-5 w-5"
	viewBox="0 0 20 20"
	fill="currentColor"
>
	<path
		fill-rule="evenodd"
		d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
		clip-rule="evenodd"
	/>
</svg>
