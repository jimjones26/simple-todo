import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from './schema.js';

export const load = async () => {
	const form = await superValidate(null, loginSchema);
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, loginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: Implement magic link sending logic here

		return { form };
	}
};
