import type { CustomSession } from '$lib/stores.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$db/db';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    // get the session
    const session = await locals.getSession() as CustomSession;
    const accountId = session.account.id;

    const data = await request.json();
    //escape data.url like a uri
    const lastUrl = encodeURIComponent(data.url);


    //save url to account lastUrl
    await prisma.account.update({
        where: { id: accountId },
        data: { lastUrl: lastUrl }
    });

    return json({ success: true });
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals }) {
    // get the session
    const session = await locals.getSession() as CustomSession;
    const accountId = session.account.id;

    //read out the lastUrl
    const account = await prisma.account.findUnique({
        where: { id: accountId },
        select: { lastUrl: true }
    });

    if (!account?.lastUrl) {
        return json({ lastUrl: null });
    }

    //decode the lastUrl
    const lastUrl = decodeURIComponent(account.lastUrl);
    return json({ lastUrl });
}