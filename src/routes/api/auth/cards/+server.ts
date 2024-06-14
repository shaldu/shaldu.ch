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
    const mode = url.searchParams.get('mode') as 'new' | 'easy' | 'hard' | 'all' | 'everything' ?? 'new';

    const accountId = session.account.id;
    let cards: Cards[] | Cards = [];
    
    if (mode === 'everything') {
        cards = await prisma.cards.findMany({
            where: {
                accountId
            }
        });
    }

    if (mode === 'new') {
        cards = await prisma.cards.findMany({
            where: {
                accountId,
                repeats: {
                    lt: 3
                }
            }
        });
        cards = getRandomCard(cards);
    }

    if (mode === 'easy') {
        //only get first card
        cards = await prisma.cards.findMany({
            where: {
                accountId,
                knowledgeScore: {
                    gte: 50
                }
            }
        });
        cards = getRandomCard(cards);
    }

    if (mode === 'hard') {
        cards = await prisma.cards.findMany({
            where: {
                accountId,
                knowledgeScore: {
                    lt: 50
                }
            }
        });
        cards = getRandomCard(cards);
    }

    if (mode === 'all') {
        cards = await prisma.cards.findMany({
            where: {
                accountId
            }
        });
        cards = getRandomCard(cards);
    }



    if (!cards) {
        return json({ message: 'No cards found', card:null });
    }

    return json({ message: 'success', card: cards });
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

function calculateNewKnowledgeScore(result: 'easy' | 'medium' | 'hard', knowledgeScore: number, repeats: number) {
    let minStudied = 2; //the minimum number of times a card should be studied before it is considered learned
    let resultScore = 0;
    if (result === 'easy') {
        resultScore = 2.8;
    } else if (result === 'medium') {
        const sub = ((Math.floor(knowledgeScore / 10) / 10)*2) ?? 0;
        resultScore = 2 - sub;
    } else {
        const sub = ((Math.floor(knowledgeScore / 10) / 10)*3) ?? 0;
        resultScore = 0.8 - sub;
    }

    repeats = repeats === 0 ? 1 : repeats;
    let newScore = (Math.min(12, Math.max(-8,((Math.floor(repeats / minStudied)) * resultScore ))) + knowledgeScore);
    //limit 0 - 100
    return Math.min(100, Math.max(0, newScore));
}

export async function PUT({ request, locals, url }) {

    // get the session
    const session = await locals.getSession() as CustomSession;
    if (session === undefined || session.account === undefined) {
        return json({ message: 'Unauthorized' });
    }

    const accountId = session.account.id;
    const data = await request.json();
    const { cardId, result, knowledgeScore, repeats } = data;

    if (!cardId || result === undefined) {
        return json({ message: 'Invalid data' });
    }

    //TODO: calculate new knowledge score round to 1 decimal places
    const newKnowledgeScore =  Math.round(calculateNewKnowledgeScore(result, knowledgeScore, repeats) * 10) / 10;

    //where cardId = cardId and accountId = accountId
    //and accountId = accountId
    const card = await prisma.cards.updateMany({
        
        where: {
            AND: [
				{ id: cardId },
				{ accountId: accountId }
			]
        },

        //update repeats do +1
        data: {
            repeats: {
                increment: 1
            },
            knowledgeScore: newKnowledgeScore
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