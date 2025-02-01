import q from '$lib/drizzle/queries';
import { sendToListener, switchGame, removeGame } from '$lib/emitter/server';
import { StatusCodes } from '$lib/StatusCodes';
import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { getChatChannel } from '$lib/drizzle/queries/chat';

export const POST: RequestHandler = async ({ url, locals }) => {
	const id = url.searchParams.get('id');
	const game_id = url.searchParams.get('game_id');
	if (!id) error(StatusCodes.BAD_REQUEST);

	if (game_id) {
		const listener = switchGame(id, game_id);
		if (!listener) error(StatusCodes.BAD_REQUEST);

		const game = await q.getGame(game_id);
		if (game) {
			sendToListener(id, { type: 'fullUpdate', data: game });

			let channel = 'GLOBAL';
			const gu = game.users.find(x => x.user_id == locals?.user?.id);
			if (gu && game.state == 1) {
				channel = gu.team_name;
			}

			sendToListener(id, { type: 'fullChatUpdate', data: await getChatChannel(game_id, channel) })
		}
		return json(listener);
	} else {
		const listener = removeGame(id);
		if (!listener) error(StatusCodes.BAD_REQUEST);
		return json(listener);
	}
};
