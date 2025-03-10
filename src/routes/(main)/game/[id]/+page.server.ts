import type { PageServerLoad } from './$types';
import q from '$lib/drizzle/queries';
import { error, redirect } from '@sveltejs/kit';
import { StatusCodes } from '$lib/StatusCodes';
import { sendToChannel, sendToGame } from '$lib/emitter/server';
import { sendBoard } from '$lib/server/bancho/bancho_board';
import { startGame } from '$lib/server/game/start';

export const load: PageServerLoad = async ({ params, locals, url }) => {
	const join = url.searchParams.get('join') == '' ? true : false;
	const code = url.searchParams.get('code');

	const game = await q.gameExists(params.id);
	if (!game) error(StatusCodes.NOT_FOUND);

	// Auto join game by appending `join` to query string
	if (join && locals.user) {
		await q.joinGame(`gam_${params.id}`, locals.user.id);
		redirect(StatusCodes.TEMPORARY_REDIRECT, `/game/${params.id}`);
	}

	// If the code matches, give them the invited tag
	if (code && locals.user) {
		if (game?.link_id == code) {
			await q.setInvited(`gam_${params.id}`, locals.user.id);
			redirect(StatusCodes.TEMPORARY_REDIRECT, `/game/${params.id}`);
		}
	}

	const is_host = locals.user ? await q.isHost(game.id, locals.user?.id) : false;

	// Private Games
	if (!game.public) {
		if (!locals.user) {
			redirect(
				StatusCodes.TEMPORARY_REDIRECT,
				`/auth/login/osu?from=/game/${params.id}%3F${url.searchParams.toString()}`
			);
		}

		if (await q.isInvited(game.id, locals.user?.id)) return { game_id: game.id, is_host, invited: true };

		return { game_id: game.id, is_host, invited: false };
	}

	return { game_id: game.id, is_host, invited: true };
};

export const actions = {
	join_game: async ({ request, params, locals }) => {
		const form = await request.formData();
		const linkId = params.id;
		const team = form.get('team');
		const user = locals.user;
		const game = await q.gameExists(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!team || !game || typeof team != 'string') error(StatusCodes.BAD_REQUEST);

		if (!game.public) {
			const invited = await q.isInvited(game.id, user.id);
			if (!invited) error(StatusCodes.UNAUTHORIZED);
		}

		const fulluser = await q.joinGame(game.id, user.id, team);
		if (fulluser == null) error(StatusCodes.BAD_REQUEST, 'User is already in game');

		sendToGame(game.id, {
			type: 'gameUser',
			data: {
				type: 'join',
				user: fulluser
			}
		});
	},
	switch_team: async ({ request, params, locals }) => {
		const form = await request.formData();
		const linkId = params.id;
		const team = form.get('team');
		const guid = form.get('user_id');
		const actor = locals.user;
		const game = await q.gameExists(linkId);

		if (!actor) error(StatusCodes.UNAUTHORIZED);
		if (!team || !game || typeof team != 'string' || typeof guid != 'string')
			error(StatusCodes.BAD_REQUEST);

		if (!game.public) {
			const invited = await q.isInvited(game.id, actor.id);
			if (!invited) error(StatusCodes.UNAUTHORIZED);
		}

		const is_host = await q.isHost(game.id, actor.id);
		if (!is_host) {
			const can_switch = await q.canSwitch(game.id, guid, actor.id);
			if (!can_switch) error(StatusCodes.UNAUTHORIZED);
		}

		const fulluser = await q.switchTeams(guid, team);
		if (fulluser == null) error(StatusCodes.BAD_REQUEST, 'User is not in game');

		sendToGame(game.id, {
			type: 'gameUser',
			data: {
				type: 'switch',
				user: fulluser
			}
		});
	},
	leave_game: async ({ params, locals }) => {
		const linkId = params.id;
		const user = locals.user;
		const game = await q.gameExists(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!game) error(StatusCodes.BAD_REQUEST);

		if (!game.public) {
			const invited = await q.isInvited(game.id, user.id);
			if (!invited) error(StatusCodes.UNAUTHORIZED);
		}

		const fulluser = await q.leaveGame(game.id, user.id);
		if (fulluser == null) error(StatusCodes.BAD_REQUEST);

		sendToGame(game.id, {
			type: 'gameUser',
			data: {
				type: 'leave',
				user: fulluser
			}
		});
	},
	chat: async ({ params, request, locals }) => {
		const user = locals.user;
		const linkId = params.id;
		const game = await q.gameExists(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!game) error(StatusCodes.BAD_REQUEST);

		if (!game.public) {
			const invited = await q.isInvited(game.id, user.id);
			if (!invited) error(StatusCodes.UNAUTHORIZED);
		}

		const body = await request.formData();

		const message = body.get('message');
		const channel = body.get('channel');
		if (!message || typeof message != 'string') error(StatusCodes.BAD_REQUEST);
		if (!channel || typeof channel != 'string') error(StatusCodes.BAD_REQUEST);

		const msg = await q.sendChat(user.id, game.id, message, channel);
		if (!msg) error(StatusCodes.BAD_REQUEST, 'Gameuser is invalid');

		if (channel == 'GLOBAL') {
			sendToGame(game.id, {
				type: 'chat',
				data: msg
			})
		} else {
			sendToChannel(game.id, channel, {
				type: 'chat',
				data: msg
			});
		}
	},
	send_board: async ({ params, locals }) => {
		const user = locals.user;
		const linkId = params.id;
		const game_check = await q.gameExists(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!game_check) error(StatusCodes.BAD_REQUEST);

		if (!game_check.public) {
			const invited = await q.isInvited(game_check.id, user.id);
			if (!invited) error(StatusCodes.UNAUTHORIZED);
		}

		const game = await q.getGame(game_check.id);
		if (!game) error(StatusCodes.BAD_REQUEST);

		sendBoard(user.id, game);
	},
	start_game: async ({ params, locals }) => {
		const user = locals.user;
		const linkId = params.id;
		const game_check = await q.gameExists(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!game_check) error(StatusCodes.BAD_REQUEST);

		const is_host = await q.isHost(game_check.id, user.id);
		if (!is_host) error(StatusCodes.UNAUTHORIZED);

		await startGame(game_check.id);
	},
	change_settings: async ({ params, locals, request }) => {
		const form = await request.formData();
		const linkId = params.id;
		const actor = locals.user;
		const game_check = await q.gameExists(linkId);

		if (!actor) error(StatusCodes.UNAUTHORIZED);
		if (!game_check) error(StatusCodes.BAD_REQUEST);

		const is_host = await q.isHost(game_check.id, actor.id);
		if (!is_host) error(StatusCodes.UNAUTHORIZED);

		const game = await q.getGame(game_check.id);
		if (!game) error(StatusCodes.BAD_REQUEST);

		// Literally anything would fix this, ZOD, tRPC, etc.
		// but I'm lazy and want less dependencies, so we're rolling with it.
		const min_sr = form.get('min_sr');
		if (min_sr && typeof min_sr == 'string' && !isNaN(parseFloat(min_sr)))
			game.min_sr = parseFloat(min_sr);
		const max_sr = form.get('max_sr');
		if (max_sr && typeof max_sr == 'string' && !isNaN(parseFloat(max_sr)))
			game.max_sr = parseFloat(max_sr);

		const min_length = form.get('min_length');
		if (min_length && typeof min_length == 'string' && !isNaN(parseFloat(min_length)))
			game.min_length = parseFloat(min_length);
		const max_length = form.get('max_length');
		if (max_length && typeof max_length == 'string' && !isNaN(parseFloat(max_length)))
			game.max_length = parseFloat(max_length);

		const min_rank = form.get('min_rank');
		if (min_rank && typeof min_rank == 'string' && !isNaN(parseFloat(min_rank)))
			game.min_rank = parseFloat(min_rank);
		const max_rank = form.get('max_rank');
		if (max_rank && typeof max_rank == 'string' && !isNaN(parseFloat(max_rank)))
			game.max_rank = parseFloat(max_rank);

		const is_public = form.get('public') === 'true';
		if (form.has('public') && typeof is_public == 'boolean') game.public = is_public;

		const settings: Bingo.SettingsUpdate = {
			min_sr: game.min_sr ?? undefined,
			max_sr: game.max_sr ?? undefined,
			min_length: game.min_length ?? undefined,
			max_length: game.max_length ?? undefined,
			min_rank: game.min_rank ?? undefined,
			max_rank: game.max_rank ?? undefined,
			public: game.public ?? undefined
		};

		await q.updateGameSettings(game.id, settings);
		sendToGame(game.id, {
			type: 'fullUpdate',
			data: game
		});
	},
	delete_game: async ({ params, locals }) => {
		const user = locals.user;
		const linkId = params.id;
		const game_check = await q.gameExists(linkId);

		if (!user) error(StatusCodes.UNAUTHORIZED);
		if (!game_check) error(StatusCodes.BAD_REQUEST);

		const is_host = await q.isHost(game_check.id, user.id);
		if (!is_host) error(StatusCodes.UNAUTHORIZED);

		const success = await q.deleteGame(game_check.id);
		if (!success) error(StatusCodes.BAD_REQUEST);
	},
};
