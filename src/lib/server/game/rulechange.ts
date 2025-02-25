import q from '$lib/drizzle/queries';
import { sendToGame } from '$lib/emitter/server';

export const claimchange = async (game_id: string, rule: string) => {
	const settings = {
		claim_condition: rule
	};
	await q.updateGameSettings(game_id, settings);
	const game = await q.getGame(game_id);
	if (!game) return;

	sendToGame(game_id, {
		type: 'fullUpdate',
		data: game
	});
};
