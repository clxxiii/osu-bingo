export const load = ({ url }) => {
	const path = url.pathname

	if (path.match("/game/\\w+")) {
		const game_id = url.pathname.slice(6)
		return { game_id };
	}
	return { game_id: null };
};
