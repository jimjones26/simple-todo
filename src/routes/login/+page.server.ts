import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from "./schema.js";
import { zod } from "sveltekit-superforms/adapters";

export const load = async () => {
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(zod(loginSchema));

		if (!form.valid) { // Keep existing logic
			return fail(400, { form });
		}

		// TODO: Implement magic link sending logic here
		const { email } = form.data;

		try {
			await locals.pb.collection('users').requestVerification(email);
		} catch (err) {
			console.error('Error requesting verification:', err);
			// Handle specific errors, like already verified, etc.
			return fail(500, { form, message: 'Failed to send verification email.' });
		}

		// Redirect to a "check your email" page
		throw redirect(303, '/login/sent');

	}
};
