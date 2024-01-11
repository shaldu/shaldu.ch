import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';

import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { prisma } from '$db/db';
import type { Session } from '@auth/core/types';
import type { JWT } from '@auth/core/jwt';
import type { Account } from '@prisma/client';


async function authorization({ event, resolve }: { event: any; resolve: any }) {
	//list of protected routes

	if (event.url.pathname.startsWith('/api/auth')) {
		const session = await event.locals.getSession();

		if (!session) {
			throw redirect(303, '/');
		}

	}

	// If the request is still here, just proceed as normally
	return resolve(event);
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(
	SvelteKitAuth({
		providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
		callbacks: {
			signIn: async ({ user }) => {

				const usr = await prisma.account.findFirst({
					where: {
						githubId: user.id,
					}
				});
				if (!usr) {
					const newUsr = await prisma.account.create({
						data: {
							githubId: user.id,
						}
					});
					//also create a profile
					await prisma.profile.create({
						data: {
							accountId: newUsr.id,
							username: user?.name ?? 'Anonymous',
						}
					});
				}

				return true;
			},
			jwt: async ({ token, user }) => {
				if (!user) return token;

				token.id = user.id;
				return token;
			},
			session: async ({ session, token }: { session: Session, token: JWT }) => {

				const usr = await prisma.account.findFirst({
					where: {
						githubId: token.githubId as string,
					},
					include: {
						profile: {
							include: {
									characters: {
										select: {
											id: true,
										}
									}
								}
							}
						},
				});
				if (usr) {
					//@ts-expect-error
					session.account = usr;
				}
				return session;
			}
		}
	}),
	authorization,

);