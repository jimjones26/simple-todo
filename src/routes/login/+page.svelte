<script>
	import { enhance, applyAction } from 'sveltekit-superforms/client';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { loginSchema } from './schema'; // Assuming you will create this schema
	import { Button } from '$lib/components/ui/button'; // Assuming you have shadcn-svelte components

	export let data;

	const form = superForm(data.form, {
		onSubmit: () => {
			console.log('Login form submitted');
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				console.log('Login successful');
				// Optionally redirect or show success message
			}
		},
		onError: ({ result }) => {
			console.log('Login error', result);
		},
		taintedMessage: false,
		validators: zod(loginSchema)
	});

	const { form: formData, errors, enhance: formEnhance, submitting, constraints } = form;
</script>

<div class="container flex min-h-screen items-center justify-center">
	<div class="w-full max-w-md">
		<div class="text-center">
			<h1 class="text-2xl font-bold">Login</h1>
		</div>
		<form method="POST" class="space-y-4" use:formEnhance>
			<div>
				<label class="block text-sm font-medium text-gray-700" for="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					class="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm {$errors.email
						? 'border-red-500'
						: ''}"
					aria-invalid={$errors.email ? 'true' : undefined}
					bind:value={$formData.email}
					{...$constraints.email}
				/>
				{#if $errors.email}
					<div class="mt-1 text-sm text-red-500">{$errors.email}</div>
				{/if}
			</div>
			<div>
				<Button type="submit" disabled={$submitting} class="w-full">
					{#if $submitting}
						Logging in...
					{:else}
						Login
					{/if}
				</Button>
			</div>
		</form>
	</div>
</div>
