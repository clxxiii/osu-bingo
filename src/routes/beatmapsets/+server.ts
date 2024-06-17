import q from '$lib/drizzle/queries';
import { getBeatmaps } from '$lib/server/osu';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) return error(StatusCodes.UNAUTHORIZED);

	const token = await q.getToken(locals.user.id);
	const beatmaps = await getBeatmaps(4.0, 5.0, token.access_token);
	return json(beatmaps);
};
