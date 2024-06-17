import type { PageServerLoad } from './$types';
import q from '$lib/drizzle/queries';
import { error } from '@sveltejs/kit';
import { StatusCodes } from '$lib/StatusCodes';

export const load: PageServerLoad = async ({ params }) => {
	const game = await q.getGameFromLinkId(params.id);
	if (!game) error(StatusCodes.NOT_FOUND);
	return { game };
};
