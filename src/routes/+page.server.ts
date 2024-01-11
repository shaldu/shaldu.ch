import type { Actions } from './$types';
import { sessionStore } from '$lib/stores';
import { prisma } from '$db/db';

export const actions = {
    createCharacter: async (event) => {
        const formData = await event.request.formData();
        const characterName = formData.get('characterName');

        //validate character name, max length 20, min length 3, no special characters, allow whitespace
        if (!characterName || typeof characterName !== 'string' || characterName.length < 3 || characterName.length > 20 || !/^[a-zA-Z0-9 ]+$/.test(characterName)) {
            return {
                status: 400,
                body: {
                    error: 'Must be between 3 and 20 characters long, and cant contain special characters'
                }
            }
        }

        const session = await event.locals.getSession();

        //@ts-ignore
        const profileId = session?.account?.profile?.id ?? null;

        if (!profileId) {
            return {
                status: 401,
                body: {
                    error: 'You must be logged in to create a character'
                }
            }
        }

        const character = await prisma.character.create({
            data: {
                name: characterName as string,
                profileId: profileId as string,
            }
        });
    

        return {
            test: 'test'
        }
    }
} as Actions