import type { CustomSession } from '$lib/stores.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$db/db';

export async function POST({ request, locals, url }) {
	//get mode
	// get the session
	const session = await locals.getSession() as CustomSession;
	if (session === undefined || session.account === undefined) {
		return json({ message: 'Unauthorized' });
	}

	const accountId = session.account.id;
	const data = await request.json();

	const { bookmarkTitle, bookmarkDescription, pdfFileId, page } = data;
	//todo check if title is not empty
	//todo check if pdfFileId is not empty

	if (bookmarkTitle === undefined || bookmarkTitle === '') {
		return json({
			status: 400,
			body: {
				message: 'Failed to add Bookmark',
				caption: '<p>Bookmark Title is required!</p>'
			}
		});
	}

	if (pdfFileId === undefined || pdfFileId === '') {
		return json({
			status: 400,
			body: {
				message: 'Failed to add Bookmark',
				caption: '<p>Something went wrong try again</p>'
			}
		});
	}

	//todo add the bookmark to the database
	const bookmark = await prisma.bookmarks.create({
		data: {
			title: bookmarkTitle,
			description: bookmarkDescription,
			pdfFileId: pdfFileId,
			page: page,
			progress: 0,
		}
	});

	if (bookmark) {
		return json({
			status: 200,
			body: {
				message: 'Added Bookmark',
				caption: '<p>Bookmark: <b>' + bookmarkTitle + '</b> added successfully!</p>'
			}
		});
	} else {
		return json({
			status: 500,
			body: {
				message: 'Failed to add Bookmark',
				caption: '<p>Bookmark: <b>' + bookmarkTitle + '</b> failed to be added!</p>'
			}
		});
	}
}