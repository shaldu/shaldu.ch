import type { CustomSession } from '$lib/stores.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$db/db';
import { Cards } from '@prisma/client';

export async function POST({ request, locals }) {
	//get mode
	// get the session
	const session = await locals.getSession() as CustomSession;
	if (session === undefined || session.account === undefined) {
		return json({ message: 'Unauthorized' });
	}

	const accountId = session.account.id;
	const data = await request.json();
	const { title, definition} = data;

    if (!title || !definition) {
        return json({ message: 'Invalid data' });
    }

    const card: Cards = await prisma.cards.create({
        data: {
            title,
            definition,
            accountId,
            repeats: 0,
            knowledgeScore: 0,
        }
    });

    return json({ message: 'success' });
}