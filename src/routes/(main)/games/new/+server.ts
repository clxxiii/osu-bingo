import q from '$lib/drizzle/queries';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { noneTeam } from '$lib/drizzle/queries/gameuser';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) error(StatusCodes.UNAUTHORIZED);

	// Check if user is already a host of a game
	const alreadyHost = await q.isHostOfGame(locals.user.id);
	if (alreadyHost) {
		error(StatusCodes.BAD_REQUEST, "You already hosting an active game!")
	}

	const game = await q.newGame();
	await q.joinGame(game.id, locals.user.id, noneTeam);
	await q.setHost(game.id, locals.user.id);
	return json(game);
};
