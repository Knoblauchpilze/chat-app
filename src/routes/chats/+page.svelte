<script lang="ts">
	import { FlexContainer, StyledButton, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';

	let { data } = $props();
</script>

<FlexContainer bgColor="bg-overlay" styling="w-3/5">
	<StyledTitle text="Welcome to the great nothing, '{data.name}'" />

	<form method="POST" action="?/logout">
		<StyledButton text="Switch account" />
	</form>
</FlexContainer>
