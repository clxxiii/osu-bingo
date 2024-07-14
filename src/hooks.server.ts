import { redirect, type Handle } from '@sveltejs/kit';
import * as jose from 'jose';
import { JWT_SECRET } from '$env/static/private';
import q from '$lib/drizzle/queries';
import { StatusCodes } from '$lib/StatusCodes';
import { connect } from '$lib/server/bancho';

// Start Polling Services
import { tokens, events } from '$lib/server/polling';
import { setup as watch } from "$lib/server/game/watch"
tokens.setup()
events.setup()
watch()
connect()

const jwt_secret = new TextEncoder().encode(JWT_SECRET);

// Request Handler (Run before every request)
export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('osu_bingo_token');

	// Redirect to game page
	if (event.route.id == null) {
		const match = event.url.pathname.match(/^\/(?:\D{4})$/g);
		if (match != null) {
			const link = match[0].slice(1, 5);
			const gameId = await q.gameLinkToId(link);
			if (gameId != null) {
				redirect(StatusCodes.TEMPORARY_REDIRECT, `/game/${gameId.split('_')[1]}?code=${link}`);
			}
		}
	}

	// Login Stuff
	if (sessionToken) {
		try {
			const { payload } = await jose.jwtVerify(sessionToken, jwt_secret);
			const userId = payload.user_id;
			if (!userId || typeof userId != 'number') throw 'No User ID in token';

			// Get user from database
			const user = await q.getUserFromSessionToken(sessionToken);

			if (!user || user.id != userId) throw 'Session is invalid!';

			event.locals.user = user;
		} catch (error) {
			console.log(error);
			event.cookies.delete('osu_bingo_token', { path: '/' });
		}
	}

	return await resolve(event);
};
