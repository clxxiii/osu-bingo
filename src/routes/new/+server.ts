import q from '$lib/drizzle/queries';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) error(StatusCodes.UNAUTHORIZED);

	const game = await q.newGame();
	await q.fillSquares(game.id, 4.5, 5.5, 'osu');
	return json(await q.getGame(game.id));
};
