// @ts-nocheck
import type { LayoutServerLoad } from "./$types";

export const load = ({ locals, url }: Parameters<LayoutServerLoad>[0]) => {
	const path = url.pathname

	if (path.match("/game/\\w+")) {
		const game_id = url.pathname.slice(6)
		return { user: locals.user, game_id };
	}
	return { user: locals.user, game_id: null };
};