import type { PageServerLoad } from './$types';
import q from '$lib/drizzle/queries';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from '$lib/StatusCodes';
import { sendEvent } from '$lib/server/game/emitter';
import { sendEvent as sendChat } from "$lib/server/game/chat_emitter"
import { sendBoard } from '$lib/server/bancho/bancho_board';
import { startGame } from '$lib/server/game/start';

export const load: PageServerLoad = async ({ params, locals, url }) => {
	const join = url.searchParams.get('join') == '' ? true : false
	const code = url.searchParams.get('code');

	// Auto join game by appending `join` to query string
	if (join && locals.user) {
		await q.joinGame(`gam_${params.id}`, locals.user.id);
		redirect(StatusCodes.TEMPORARY_REDIRECT, `/game/${params.id}`)
	}
	if (code && locals.user) {
		const game = await q.getGame(`gam_${params.id}`);
		if (game?.link_id == code) {
			await q.setInvited(`gam_${params.id}`, locals.user.id)
			redirect(StatusCodes.TEMPORARY_REDIRECT, `/game/${params.id}`)
		}
	}

	const game = await q.getGame(`gam_${params.id}`);
	if (!game) error(StatusCodes.NOT_FOUND);

	const is_host = game.hosts.find(x => x.id == locals.user?.id) != undefined;

	// Private Games
	if (!game.public) {
		if (!locals.user) {
			redirect(StatusCodes.TEMPORARY_REDIRECT, `/auth/login/osu?from=/game/${params.id}%3F${url.searchParams.toString()}`)
		}

		if (await q.isInvited(game.id, locals.user?.id)) return { game, is_host }

		return { game: null, is_host }
	}

	return { game, is_host };
};

export const actions = {
	join_game: async ({ request, params, locals }) => {
		const form = await request.formData()
		const linkId = params.id;
		const team = form.get('team');
		const user = locals.user;
		const game_id = await q.gameExists(linkId);

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
		sendChat(game_id, 'global', {
			type: 'player',
			data: {
				action: 'join',
				player: fulluser
			}
		})
	},
	leave_game: async ({ params, locals }) => {
		const linkId = params.id;
		const user = locals.user;
		const game_id = await q.gameExists(linkId);

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
		sendChat(game_id, 'global', {
			type: 'player',
			data: {
				action: 'leave',
				player: fulluser
			}
		})
	},
	chat: async ({ params, request, locals }) => {
		const user = locals.user;
		const linkId = params.id;
		const game_id = await q.gameExists(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!game_id) error(StatusCodes.BAD_REQUEST);

		const body = await request.formData()

		const message = body.get('message');
		const channel = body.get('channel');
		if (!message || typeof message != 'string') error(StatusCodes.BAD_REQUEST)
		if (!channel || typeof channel != 'string') error(StatusCodes.BAD_REQUEST)

		const chat = await q.sendChat(user.id, game_id, message, channel)
		if (!chat) error(StatusCodes.BAD_REQUEST, "Gameuser is invalid")
		sendChat(game_id, channel, {
			type: 'chat',
			data: chat
		})
	},
	send_board: async ({ params, locals }) => {
		const user = locals.user;
		const linkId = params.id;
		const game_id = await q.gameExists(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!game_id) error(StatusCodes.BAD_REQUEST);

		const game = await q.getGame(game_id);
		if (!game) error(StatusCodes.BAD_REQUEST);

		sendBoard(user.id, game);
	},
	start_game: async ({ params, locals }) => {
		const user = locals.user;
		const linkId = params.id;
		const game_id = await q.gameExists(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!game_id) error(StatusCodes.BAD_REQUEST);

		const game = await q.getGame(game_id);
		if (!game) error(StatusCodes.BAD_REQUEST);

		const is_host = game.hosts.filter(x => x.id == user.id).length != 0
		if (!is_host) error(StatusCodes.UNAUTHORIZED)

		await startGame(game_id);
	}
}