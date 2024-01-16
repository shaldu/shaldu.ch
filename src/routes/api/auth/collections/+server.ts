import type { CustomSession } from '$lib/stores.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$db/db';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals }) {
	// get the session
	const session = await locals.getSession() as CustomSession;
	const accountId = session.account.id;

	// get all collections for the user
	const collections = await prisma.learnCollection.findMany({
		where: {
			accountId
		}
	});

	// return the collections
	return json(collections);
}