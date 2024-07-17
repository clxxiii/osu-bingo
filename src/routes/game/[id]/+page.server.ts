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
	switch_team: async ({ request, params, locals }) => {
		const form = await request.formData()
		const linkId = params.id;
		const team = form.get('team');
		const guid = form.get('user_id');
		const actor = locals.user;
		const game_id = await q.gameExists(linkId);

		if (!actor) error(StatusCodes.UNAUTHORIZED);
		if (!team || !game_id || typeof team != 'string' || typeof guid != 'string') error(StatusCodes.BAD_REQUEST);

		const is_host = await q.isHost(game_id, actor.id);
		if (!is_host) {
			const can_switch = await q.canSwitch(game_id, guid, actor.id);
			if (!can_switch) error(StatusCodes.UNAUTHORIZED);
		}

		const fulluser = await q.switchTeams(guid, team);
		if (fulluser == null) error(StatusCodes.BAD_REQUEST, 'User is not in game')

		sendEvent(game_id, {
			type: 'gameUser',
			data: {
				type: 'switch',
				user: fulluser
			}
		})
		sendChat(game_id, 'global', {
			type: 'player',
			data: {
				action: 'switch',
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
	},
	change_settings: async ({ params, locals, request }) => {
		const form = await request.formData()
		const linkId = params.id;
		const actor = locals.user;
		const game_id = await q.gameExists(linkId);

		if (!actor) error(StatusCodes.UNAUTHORIZED);
		if (!game_id) error(StatusCodes.BAD_REQUEST);

		const is_host = await q.isHost(game_id, actor.id);
		if (!is_host) error(StatusCodes.UNAUTHORIZED);

		const game = await q.getGame(game_id);
		if (!game) error(StatusCodes.BAD_REQUEST);

		// Literally anything would fix this, ZOD, tRPC, etc.
		// but I'm lazy and want less dependencies, so we're rolling with it.
		const min_sr = form.get('min_sr');
		if (min_sr && typeof min_sr == 'number') game.min_sr = min_sr;
		const max_sr = form.get('max_sr');
		if (max_sr && typeof max_sr == 'number') game.max_sr = max_sr;

		const min_length = form.get('min_length');
		if (min_length && typeof min_length == 'number') game.min_length = min_length;
		const max_length = form.get('max_length');
		if (max_length && typeof max_length == 'number') game.max_length = max_length;

		const min_rank = form.get('min_rank');
		if (min_rank && typeof min_rank == 'number') game.min_rank = min_rank;
		const max_rank = form.get('max_rank');
		if (max_rank && typeof max_rank == 'number') game.max_rank = max_rank;


		const is_public = form.get('public') === 'true';
		if (typeof is_public == 'boolean') game.public = is_public

		const settings: Bingo.SettingsUpdate = {
			min_sr: game.min_sr ?? undefined,
			max_sr: game.max_sr ?? undefined,
			min_length: game.min_length ?? undefined,
			max_length: game.max_length ?? undefined,
			min_rank: game.min_rank ?? undefined,
			max_rank: game.max_rank ?? undefined,
			public: game.public ?? undefined
		};

		await q.updateGameSettings(game_id, settings);
		sendEvent(game_id, {
			type: 'fullUpdate',
			data: game
		})
	}
}