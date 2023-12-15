import { start_prisma } from "$db/db";
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';

import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

start_prisma();

async function authorization({ event, resolve }) {
	//list of protected routes
	if (event.url.pathname.startsWith('/api/auth')) {
		const session = await event.locals.getSession();

		if (!session) {
			throw redirect(303, '/');
		}

	}

	// If the request is still here, just proceed as normally
	return resolve(event);
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(
	SvelteKitAuth({
		providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })]
	}),
	authorization
);