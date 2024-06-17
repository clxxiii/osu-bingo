import q from '$lib/drizzle/queries';
import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) redirect(StatusCodes.UNAUTHORIZED, '/');

	const token = await q.getToken(locals.user.id);
	const game = await q.newGame();
	await q.fillSquares(game.id, 4.5, 5.5, token.access_token);
	return json(await q.getGame(game.id));
};
