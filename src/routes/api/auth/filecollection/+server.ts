import type { CustomSession } from '$lib/stores.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$db/db';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals, url }) {
	// get the session
	const session = await locals.getSession() as CustomSession;
	const accountId = session.account.id;
	//get the collection id from request
	const collectionId = url.searchParams.get('collectionId') as string;

	// get all fileCollections for the user with the collection id and the AccountId
	const fileCollections = await prisma.pdfFile.findMany({
		where: {
			AND: [
				{ learnCollectionId: collectionId },
				{ accountId: accountId }
			]
		},
		include: {
			learnCollection: true,
		}
	});

	// return the collections
	return json(fileCollections);
}