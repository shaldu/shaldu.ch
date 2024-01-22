import type { CustomSession } from '$lib/stores.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$db/db';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals, url }) {
	// get the session
	const session = await locals.getSession() as CustomSession;
	const accountId = session.account.id;
	const collectionIds = url.searchParams.get('fileId') as string;

	const collectionIdsArray:string[] = collectionIds.split(',');

	// get all collections for the user
	const collections = await prisma.pdfFile.findMany({
		where: {
			id: {
				in: collectionIdsArray
			},
			accountId: accountId
		},
		include:{
			bookmarks: true
		}
	});

	// return the collections
	return json(collections);
}