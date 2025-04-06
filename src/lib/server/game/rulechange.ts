import q from '$lib/drizzle/queries';
import { sendToGame } from '$lib/emitter/server';

export const claimchange = async (game_id: string, rule: string) => {
	const game = await q.getGame(game_id);
	if (!game) return;

	// Just send a game update to the game so it will update the GUI
	sendToGame(game_id, {
		type: 'fullUpdate',
		data: game
	});
};
