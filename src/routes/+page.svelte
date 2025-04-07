<script lang="ts">
	import {
		FlexContainer,
		FormField,
		StyledButton,
		StyledError,
		StyledText,
		StyledTitle
	} from '@totocorpsoftwareinc/frontend-toolkit';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
		form: HTMLFormElement;
	}

	let { form = $bindable(), data }: Props = $props();

	function resetFormError() {
		if (!form) {
			return;
		}
		form.message = '';
	}
</script>

<FlexContainer bgColor="bg-overlay" styling="w-3/5">
	<StyledTitle text="Chatterly" />

	{#if !data.registered}
		<FlexContainer extensible={false} align="stretch" styling="h-3/5">
			<StyledText text="Choose your screen name" />

			<form method="POST" action="?/register" class="flex flex-1 flex-col justify-evenly">
				<FormField label="Screen name:" labelId="handle" labelStyling="text-secondary">
					<input
						id="handle"
						type="text"
						name="handle"
						placeholder="Enter your screen name"
						required
						value={form?.email ?? ''}
						oninput={resetFormError}
						class="bg-white"
					/>
				</FormField>
				<StyledButton text="Chat now!" />

				{#if form?.message}
					<div class="fixed bottom-4">
						<StyledError text="Failed to join chat: {form.message}" />
					</div>
				{/if}
			</form>
		</FlexContainer>
	{:else}
		<FlexContainer>
			<StyledTitle text="Ah this is unexpected" />
		</FlexContainer>
	{/if}
</FlexContainer>
