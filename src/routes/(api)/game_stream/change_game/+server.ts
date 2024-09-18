import q from '$lib/drizzle/queries';
import { sendToListener, switchGame, removeGame } from '$lib/emitter/server';
import { StatusCodes } from '$lib/StatusCodes';
import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { getChatChannel } from '$lib/drizzle/queries/chat';

export const POST: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	const game_id = url.searchParams.get('game_id');
	if (!id) error(StatusCodes.BAD_REQUEST);

	if (game_id) {
		const listener = switchGame(id, game_id);
		if (!listener) error(StatusCodes.BAD_REQUEST);

		const game = await q.getGame(game_id);
		if (game) {
			sendToListener(id, { type: 'fullUpdate', data: game });
			sendToListener(id, {
				type: 'fullChatUpdate',
				data: await getChatChannel(game_id, 'GLOBAL')
			});
		}
		return json(listener);
	} else {
		const listener = removeGame(id);
		if (!listener) error(StatusCodes.BAD_REQUEST);
		return json(listener);
	}
};
