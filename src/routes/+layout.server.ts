export const load = ({ locals, url }) => {
	const path = url.pathname

	if (path.match("/game/\\w+")) {
		const game_id = url.pathname.slice(6)
		console.log(game_id);
		return { user: locals.user, game_id };
	}
	return { user: locals.user, game_id: null };
};
