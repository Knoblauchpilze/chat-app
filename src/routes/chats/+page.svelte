<script lang="ts">
	import { FlexContainer, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';

	let { data } = $props();
</script>

<FlexContainer bgColor="bg-overlay" styling="w-3/5">
	<StyledTitle text="Welcome to the great nothing, '{data.name}'" />
</FlexContainer>
