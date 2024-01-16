import type { Actions } from './$types';
import type {CustomSession} from '$lib/stores';
import { prisma } from '$db/db';

export const actions = {
    createCollection: async (event) => {
        const formData = await event.request.formData();
        const collectionName = formData.get('title') as string;
        const session = await event.locals.getSession() as CustomSession;
        const accountId = session.account.id;
        
        //between 3 and 32 characters
        if (!collectionName || collectionName.length < 3 || collectionName.length > 32) {
            return {
                status: 400,
                body: {
                    message: 'Collection creation failed',
                    caption: 'Collection name must be between 3 and 32 characters.'
                }
            }
        }

        const collection = await prisma.learnCollection.create({
            data: {
                title: collectionName as string,
                account: {
                    connect: {
                        id: accountId
                    }
                }
            }
        });
        
        if (!collection) {
            return {
                status: 500,
                body: {
                    message: 'Collection creation failed',
                    caption: 'Something went wrong, please try again later.'
                }
            }
        } else {
            return {
                status: 200,
                body: {
                    message: ``,
                    caption: `Collection ${collectionName} created !`
                }
            }
        }
    }
} as Actions