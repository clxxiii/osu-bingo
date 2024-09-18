/**
 * All of the stores for keeping UI up to date.
 */
import {
	type EmitterEvent,
	isChatMessage,
	isFullChatUpdate,
	isFullUpdate,
	isGameUserUpdate,
	isLoginRequest,
	isSquareUpdate,
	isStateUpdate
} from '$lib/emitter';
import { chats, game, login_request } from '$lib/stores';

export const updateGame = (event: EmitterEvent) => {
	game.update((card) => {
		if (isFullUpdate(event)) return event.data;

		if (isLoginRequest(event)) login_request.set(event.data);

		if (isStateUpdate(event)) {
			card.state = event.data.state;
			if (event.data.winner) card.winning_team = event.data.winner ?? null;
			if (event.data.card) {
				card = event.data.card;
			}
			return card;
		}

		if (isSquareUpdate(event)) {
			if (!card.squares) return card;

			for (const score of event.data) {
				const square = card.squares.find((x) => x.id == score.score.square_id);
				if (!square) continue;
				const index = card.squares.indexOf(square);

				card.squares[index].scores.push(score.score);
				if (score.claim) {
					card.squares[index].claimed_by_id = score.score.game_user_id;
					card.squares[index].claimed_by = score.score.user;
				}
			}
		}

		if (isGameUserUpdate(event)) {
			if (event.data.type == 'join') {
				card.users.push(event.data.user);
			}

			if (event.data.type == 'leave') {
				const i = card.users.findIndex((x) => x.id == event.data.user.id);
				if (i > -1) card.users.splice(i, 1);
			}

			if (event.data.type == 'switch') {
				const i = card.users.findIndex((x) => x.id == event.data.user.id);
				if (i > -1) card.users.splice(i, 1);
				card.users.push(event.data.user);
			}
		}

		return card;
	});
	chats.update((chats) => {
		if (isStateUpdate(event)) return [];
		if (isChatMessage(event)) chats.push(event);
		if (isGameUserUpdate(event)) chats.push(event);
		if (isFullChatUpdate(event)) chats = event.data.map((x) => ({ type: 'chat', data: x }));
		return chats;
	});
};
