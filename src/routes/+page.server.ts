import type { Actions } from './$types';
import { sessionStore } from '$lib/stores';
import { prisma } from '$db/db';

export const actions = {
    createCharacter: async (event) => {
        const formData = await event.request.formData();
          

        return {
            test: 'test'
        }
    }
} as Actions