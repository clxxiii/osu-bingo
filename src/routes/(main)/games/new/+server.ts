import q from '$lib/drizzle/queries';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { noneTeam } from '$lib/drizzle/queries/gameuser';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) error(StatusCodes.UNAUTHORIZED);

	const game = await q.newGame();
	await q.joinGame(game.id, locals.user.id, noneTeam);
	await q.setHost(game.id, locals.user.id);
	redirect(StatusCodes.MOVED_TEMPORARILY, `${url.origin}/game/${game.id.slice(4)}`);
};
