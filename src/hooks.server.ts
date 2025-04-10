import { redirect, type Handle } from '@sveltejs/kit';
import * as jose from 'jose';
import { env } from '$env/dynamic/private';
import q from '$lib/drizzle/queries';
import { StatusCodes } from '$lib/StatusCodes';
import { logger } from '$lib/logger';

// Start Polling
import { tokens, events } from '$lib/server/polling';
import { setup as startWatch } from '$lib/server/game/watch';
tokens.setup();
events.setup();
startWatch();

// Connect Services
import { connect as connectBancho } from '$lib/server/bancho';
import { connect as connectRabbit } from '$lib/server/rabbit';
connectBancho();
connectRabbit();

q.deleteUnstartedGames();

const jwt_secret = new TextEncoder().encode(env.JWT_SECRET);

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
			logger.error(error as string, { type: 'invalid_session' });
			event.cookies.delete('osu_bingo_token', { path: '/' });
		}
	}

	const resolved = await resolve(event);

	// Turn searchParams into a javascript object
	const params = Array.from(event.url.searchParams.entries()).reduce(
		(a, [k, v]) => ({ ...a, [k]: v }),
		{}
	);
	const user = event.locals.user?.username;
	logger.log('http', `${resolved.status} ${event.request.method} ${event.url.pathname}`, {
		type: 'http_log',
		user,
		params,
		path: event.url.pathname,
		method: event.request.method,
		status: resolved.status
	});

	return resolved;
};
