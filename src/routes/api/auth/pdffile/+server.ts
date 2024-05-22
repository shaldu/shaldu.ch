import type { CustomSession } from '$lib/stores.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$db/db';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals, url }) {
	// get the session
	const session = await locals.getSession() as CustomSession;
	const accountId = session.account.id;
	const collectionIds = url.searchParams.get('fileId') as string;

	const collectionIdsArray: string[] = collectionIds.split(',');

	// get all collections for the user
	const collections = await prisma.pdfFile.findMany({
		where: {
			id: {
				in: collectionIdsArray
			},
			accountId: accountId
		},		
		include: {
			bookmarks: true,
			learnCollection: true,
		}
	});
	const collectionId = collections[0].learnCollectionId;
	//get all the words for the collections
	const words = await prisma.wordCollection.findMany({
		where: {
			learnCollectionId: collectionId
		}
	});

	//@ts-ignore
	collections[0].words = words ?? [];

	// return the collections
	return json(collections);
}

export async function POST({ request, locals, url }) {
	//get mode
	// get the session
	const session = await locals.getSession() as CustomSession;
	if (session === undefined || session.account === undefined) {
		return json({ message: 'Unauthorized' });
	}

	const accountId = session.account.id;
	const data = await request.json();
	const mode = data.mode;

	if (mode === 'setPdfFileProgress') {
		const pdfFileId = data.id;
		const progress = data.progress;
		return setPdfFileProgress(accountId, pdfFileId, progress);
	}
}

async function setPdfFileProgress(accountId: string, pdfFileId: string, progress: number) {
	// set the mode for the collections

	const update = await prisma.pdfFile.updateMany({
		where: {
			AND: [
				{
					id: pdfFileId,
					accountId: accountId
				}
			]
		},
		data: { progress: progress }
	});

	if (update && update.count > 0) {
		return json({ message: 'success' });
	} else {
		return json({ message: 'failed' });
	}
}