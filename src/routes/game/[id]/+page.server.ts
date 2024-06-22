import type { PageServerLoad } from './$types';
import q from '$lib/drizzle/queries';
import { error } from '@sveltejs/kit';
import { StatusCodes } from '$lib/StatusCodes';
import { sendEvent } from '$lib/server/game/emitter';

export const load: PageServerLoad = async ({ params }) => {
	const game = await q.getGameFromLinkId(params.id);
	if (!game) error(StatusCodes.NOT_FOUND);
	return { game };
};

export const actions = {
	join_game: async ({ request, params, locals }) => {
		const form = await request.formData()
		const linkId = params.id;
		const team = form.get('team');
		const user = locals.user;
		const game_id = await q.gameLinkToId(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!team || !game_id || typeof team != 'string') error(StatusCodes.BAD_REQUEST);

		const fulluser = await q.joinGame(game_id, user.id, team);
		if (fulluser == null) error(StatusCodes.BAD_REQUEST, 'User is already in game')

		sendEvent(game_id, {
			type: 'gameUser',
			data: {
				type: 'join',
				user: fulluser
			}
		})
	},
	leave_game: async ({ params, locals }) => {
		const linkId = params.id;
		const user = locals.user;
		const game_id = await q.gameLinkToId(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!game_id) error(StatusCodes.BAD_REQUEST);

		const fulluser = await q.leaveGame(game_id, user.id);
		if (fulluser == null) error(StatusCodes.BAD_REQUEST)

		sendEvent(game_id, {
			type: 'gameUser',
			data: {
				type: 'leave',
				user: fulluser
			}
		})
	},
	chat: async ({ params, request, locals }) => {
		const user = locals.user;
		const linkId = params.id;
		const game_id = await q.gameLinkToId(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!game_id) error(StatusCodes.BAD_REQUEST);

		const body = await request.formData()

		const message = body.get('message');
		const channel = body.get('channel');
		if (!message || typeof message != 'string') error(StatusCodes.BAD_REQUEST)
		if (!channel || typeof channel != 'string') error(StatusCodes.BAD_REQUEST)

		await q.sendChat(user.id, game_id, message, channel)
	}
}