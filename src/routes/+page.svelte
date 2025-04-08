<script lang="ts">
	import {
		FlexContainer,
		FormField,
		StyledButton,
		StyledError,
		StyledText
	} from '@totocorpsoftwareinc/frontend-toolkit';

	interface Props {
		form: HTMLFormElement;
	}

	let { form = $bindable() }: Props = $props();
	let isSubmitting = $state(false);
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
		<h1 class="text-secondary mb-6 text-center text-3xl font-bold italic">Welcome to Chatterly</h1>

		<form method="POST" action="?/register" class="space-y-4">
			<FormField
				labelId="handle"
				label="Your name"
				labelStyling="text-secondary mb-1 block font-medium"
			>
				<input
					type="text"
					id="handle"
					name="handle"
					placeholder="Enter your name"
					required
					value={form?.name ?? ''}
					class="border-primary-hover focus:ring-secondary w-full rounded-md border bg-white p-3 focus:ring-2 focus:outline-none"
				/>
			</FormField>

			<div class="pt-2">
				<StyledButton text={'Join the chat'} styling="w-full" />
			</div>

			<StyledText
				text="Enter any name to start chatting with others"
				textColor="text-gray-500"
				styling="mt-4 text-center text-sm"
			/>

			{#if form?.message}
				<div class="mt-4">
					<StyledError text="Failed to join chat: {form.message}" />
				</div>
			{/if}
		</form>
	</FlexContainer>
</FlexContainer>
