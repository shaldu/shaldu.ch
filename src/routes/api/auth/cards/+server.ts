import type { CustomSession } from '$lib/stores.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$db/db';
import { Cards } from '@prisma/client';

export async function GET({ request, locals, url }) {
    //get mode
    // get the session
    const session = await locals.getSession() as CustomSession;
    if (session === undefined || session.account === undefined) {
        return json({ message: 'Unauthorized' });
    }
    const mode = url.searchParams.get('mode') as 'new' | 'easy' | 'hard' | 'all' ?? 'new';

    const accountId = session.account.id;
    let cards: Cards[] | Cards = [];

    if (mode === 'all') {
        cards = await prisma.cards.findMany({
            where: {
                accountId
            }
        });
    }
    if (mode === 'easy') {
        //only get first card
        cards = await prisma.cards.findMany({
            where: {
                accountId
            }
        });
        cards = getRandomCard(cards);
    }

    return json(cards);
}



function getRandomCard(cards: Cards[]) {
    return cards[Math.floor(Math.random() * cards.length)];
}


export async function DELETE({ params, locals, url }) {
    // get the session
    const session = await locals.getSession() as CustomSession;
    if (session === undefined || session.account === undefined) {
        return json({ message: 'Unauthorized' });
    }

    const cardId = url.searchParams.get('id') as string;


    if (!cardId) {
        return json({ message: 'Invalid data' });
    }

    await prisma.cards.delete({
        where: {
            id: cardId
        }
    });

    return json({ message: 'success' });
}

export async function POST({ request, locals }) {
    //get mode
    // get the session
    const session = await locals.getSession() as CustomSession;
    if (session === undefined || session.account === undefined) {
        return json({ message: 'Unauthorized' });
    }

    const accountId = session.account.id;
    const data = await request.json();
    const { title, definition } = data;

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