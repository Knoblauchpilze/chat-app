<script lang="ts">
	import {
		FlexContainer,
		FormField,
		StyledButton,
		StyledError,
		StyledText,
		StyledTitle
	} from '@totocorpsoftwareinc/frontend-toolkit';

	interface Props {
		form: HTMLFormElement;
	}

	let { form = $bindable() }: Props = $props();

	function resetFormError() {
		if (!form) {
			return;
		}
		form.message = '';
	}
</script>

<FlexContainer bgColor="bg-overlay" styling="w-3/5">
	<StyledTitle text="Chatterly" />

	<FlexContainer extensible={false} styling="h-3/5">
		<StyledText text="Choose your screen name" />

		<form method="POST" action="?/login" class="flex flex-1 flex-col justify-evenly">
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
</FlexContainer>
