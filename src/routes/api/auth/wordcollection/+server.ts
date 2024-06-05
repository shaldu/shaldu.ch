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

	const { wordTitle, wordDefinition, learnCollectionId, page, color } = data;
    //todo check if title is not empty
    //todo check if pdfFileId is not empty

    if (wordTitle === undefined || wordTitle === '') {
        return json({
            status: 400,
            body: {
                message: 'Failed to add Word',
                caption: '<p>Word Title is required!</p>'
            }
        });
    }

    if (learnCollectionId === undefined || learnCollectionId === '') {
        return json({
            status: 400,
            body: {
                message: 'Failed to add Word',
                caption: '<p>Something went wrong try again</p>'
            }
        });
    }

    //todo add the word to the database
    const word = await prisma.wordCollection.create({
        data: {
            title: wordTitle,
            definition: wordDefinition,
            learnCollectionId: learnCollectionId,
            page: page,
            color: color,
        }
    });

    return json({
        status: 200,
        body: {
            message: 'Word added successfully',
            caption: '<p>Word added successfully</p>'
        }
    });

}

export async function GET({ params, locals }) {
    // get the session
    const session = await locals.getSession() as CustomSession;
    if (session === undefined || session.account === undefined) {
        return json({ message: 'Unauthorized' });
    }

    const accountId = session.account.id;
    

    return json({
        status: 200,
        body: {
            words: {}
        }
    });
}

export async function DELETE({ params, locals, url }) {
    // get the session
    const session = await locals.getSession() as CustomSession;
    if (session === undefined || session.account === undefined) {
        return json({ message: 'Unauthorized' });
    }

    const accountId = session.account.id;
    const wordId = url.searchParams.get('wordid') as string;
    console.log(wordId);
    

    //todo delete the word from the database
    const word = await prisma.wordCollection.delete({
        where: {
            id: wordId
        }
    });

    return json({
        status: 200,
        body: {
            message: 'Word deleted successfully',
            caption: '<p>Word deleted successfully</p>'
        }
    });
}