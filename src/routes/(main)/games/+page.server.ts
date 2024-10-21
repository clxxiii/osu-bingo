import type { PageServerLoad } from './$types';
import q from '$lib/drizzle/queries';

export const load: PageServerLoad = async () => {
	const games = await q.getAllGames();
	return { games };
};
