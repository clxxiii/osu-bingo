import type { PageServerLoad } from './$types';
import q from '$lib/drizzle/queries';

export const load: PageServerLoad = async () => {
	const games = await q.getAllGames(5);
	return { games };
};
