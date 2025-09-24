// @ts-nocheck
import type { PageServerLoad } from './$types';
import q from '$lib/drizzle/queries';

export const load = async () => {
	const games = await q.getAllGames(5);
	return { games };
};
;null as any as PageServerLoad;