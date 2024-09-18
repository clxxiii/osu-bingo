import { and, eq, not, or } from 'drizzle-orm';
import { db } from '..';
import { BingoGame, BingoSquare, GameUser, Map, MapStats, Score, TimeEvent, User } from '../schema';
import { getTemplate } from './template';
import { logger } from '$lib/logger';

export const newGame = async () => {
	const randomLetter = () => {
		const A = 65;
		const random = Math.floor(Math.random() * 26);
		return String.fromCharCode(A + random);
	};
	let link_id = '';
	// Check for duplicate link IDs
	while (true) {
		link_id = `${randomLetter()}${randomLetter()}${randomLetter()}${randomLetter()}`;

		logger.silly('Started db request', { function: 'newGame', obj: 'duplicate', dir: 'start' });
		const duplicate = await db
			.select()
			.from(BingoGame)
			.where(and(eq(BingoGame.link_id, link_id), eq(BingoGame.state, 0)));
		logger.silly('Finished db request', { function: 'newGame', obj: 'duplicate', dir: 'end' });

		if (duplicate.length == 0) break;
	}

	logger.silly('Started db request', { function: 'newGame', obj: 'insert', dir: 'start' });
	const insert = (
		await db
			.insert(BingoGame)
			.values({
				link_id
			})
			.returning()
	)[0];
	logger.silly('Finished db request', { function: 'newGame', obj: 'insert', dir: 'end' });
	return insert;
};

export const getGame = async (game_id: string): Promise<Bingo.Card | null> => {
	logger.silly('Started db request', { function: 'getGame', obj: 'game', dir: 'start' });
	const game = (await db.select().from(BingoGame).where(eq(BingoGame.id, game_id)))[0];
	logger.silly('Finished db request', { function: 'getGame', obj: 'game', dir: 'end' });
	if (!game) return null;

	const users: Bingo.Card.FullUser[] = [];
	logger.silly('Started db request', { function: 'getGame', obj: 'gameusers', dir: 'start' });
	const gameusers = await db
		.select()
		.from(GameUser)
		.where(
			and(
				eq(GameUser.game_id, game_id),
				not(eq(GameUser.team_name, 'none')),
				not(eq(GameUser.team_name, 'invited'))
			)
		);
	logger.silly('Finished db request', { function: 'getGame', obj: 'gameusers', dir: 'end' });

	for (const gameuser of gameusers) {
		logger.silly('Started db request', { function: 'getGame', obj: 'user', dir: 'start' });
		const user = (
			await db
				.select()
				.from(User)
				.where(and(eq(User.id, gameuser.user_id)))
		)[0];
		logger.silly('Finished db request', { function: 'getGame', obj: 'user', dir: 'end' });
		users.push({ ...gameuser, user });
	}

	logger.silly('Started db request', { function: 'getGame', obj: 'hosts', dir: 'start' });
	const hosts = (
		await db
			.select({ user: User })
			.from(GameUser)
			.innerJoin(User, eq(GameUser.user_id, User.id))
			.where(and(eq(GameUser.game_id, game.id), eq(GameUser.host, true)))
	).map((x) => x.user);
	logger.silly('Finished db request', { function: 'getGame', obj: 'hosts', dir: 'end' });

	logger.silly('Started db request', { function: 'getGame', obj: 'events', dir: 'start' });
	const events = await db.select().from(TimeEvent).where(eq(TimeEvent.game_id, game_id));
	logger.silly('Finished db request', { function: 'getGame', obj: 'events', dir: 'end' });
	const template = await getTemplate(game.template_id);

	if (game.state == 0) return { ...game, users, events, squares: null, hosts, template };

	const squares: Bingo.Card.FullSquare[] = [];
	logger.silly('Started db request', { function: 'getGame', obj: 'dbSquares', dir: 'start' });
	const dbSquares = await db
		.select()
		.from(BingoSquare)
		.where(eq(BingoSquare.game_id, game_id))
		.orderBy(BingoSquare.y_pos, BingoSquare.x_pos);
	logger.silly('Finished db request', { function: 'getGame', obj: 'dbSquares', dir: 'end' });

	for (const square of dbSquares) {
		logger.silly('Started db request', { function: 'getGame', obj: 'map', dir: 'start' });
		const map = (
			await db
				.select()
				.from(Map)
				.innerJoin(MapStats, eq(MapStats.map_id, Map.id))
				.where(and(eq(Map.id, square.map_id), eq(MapStats.mod_string, square.mod_string ?? '')))
		)[0];
		logger.silly('Finished db request', { function: 'getGame', obj: 'map', dir: 'end' });

		const scores: Bingo.Card.FullScore[] = [];
		logger.silly('Started db request', { function: 'getGame', obj: 'dbScores', dir: 'start' });
		const dbScores = await db.select().from(Score).where(eq(Score.square_id, square.id));
		logger.silly('Finished db request', { function: 'getGame', obj: 'dbScores', dir: 'end' });

		for (const score of dbScores) {
			logger.silly('Started db request', { function: 'getGame', obj: 'user', dir: 'start' });
			const user = users.find((x) => x.user_id == score.user_id);
			logger.silly('Finished db request', { function: 'getGame', obj: 'user', dir: 'end' });
			if (!user) continue;
			scores.push({ ...score, user });
		}

		let claimed_by: Bingo.GameUser | null = null;
		if (square.claimed_by_id) {
			logger.silly('Started db request', { function: 'getGame', obj: 'claimed_by', dir: 'start' });
			claimed_by = (
				await db.select().from(GameUser).where(eq(GameUser.id, square.claimed_by_id))
			)[0];
			logger.silly('Finished db request', { function: 'getGame', obj: 'claimed_by', dir: 'end' });
		}
		squares.push({
			...square,
			data: {
				...map.Map,
				stats: map.MapStats
			},
			claimed_by,
			scores
		});
	}

	return { ...game, users, events, squares, hosts, template };
};

export const gameLinkToId = async (link: string) => {
	logger.silly('Started db request', { function: 'gameLinkToId', obj: 'query', dir: 'start' });
	const query = (
		await db
			.select({ game_id: BingoGame.id })
			.from(BingoGame)
			.where(and(eq(BingoGame.link_id, link), or(eq(BingoGame.state, 0), eq(BingoGame.state, 1))))
	)[0];
	logger.silly('Finished db request', { function: 'gameLinkToId', obj: 'query', dir: 'end' });
	if (query == undefined) return null;

	return query.game_id;
};

export const getGameFromLinkId = async (link: string) => {
	const game_id = await gameLinkToId(link);
	if (!game_id) return null;
	return await getGame(game_id);
};

export const setGameState = async (game_id: string, state: number, winning_team?: string) => {
	logger.silly('Started db request', { function: 'setGameState', obj: 'query', dir: 'start' });
	await db.update(BingoGame).set({ state, winning_team }).where(eq(BingoGame.id, game_id));
	logger.silly('Finished db request', { function: 'setGameState', obj: 'query', dir: 'end' });

	return state;
};

export const getCurrentGames = async () => {
	logger.silly('Started db request', { function: 'getCurrentGames', obj: 'query', dir: 'start' });
	const query = await db.select({ id: BingoGame.id }).from(BingoGame).where(eq(BingoGame.state, 1));
	logger.silly('Finished db request', { function: 'getCurrentGames', obj: 'query', dir: 'end' });
	return query;
};

export const getAllGames = async () => {
	logger.silly('Started db request', { function: 'getAllGames', obj: 'query', dir: 'start' });
	const query = await db
		.select()
		.from(BingoGame)
		.orderBy(BingoGame.state)
		.limit(10)
		.where(eq(BingoGame.public, true));
	logger.silly('Finished db request', { function: 'getAllGames', obj: 'query', dir: 'end' });
	return query;
};

export const gameExists = async (unprefixed_game_id: string) => {
	logger.silly('Started db request', { function: 'gameExists', obj: 'query', dir: 'start' });
	const q = await db
		.select()
		.from(BingoGame)
		.where(eq(BingoGame.id, `gam_${unprefixed_game_id}`));
	logger.silly('Finished db request', { function: 'gameExists', obj: 'query', dir: 'end' });
	if (q.length > 0) return q[0];
	return null;
};

export const canSwitch = async (game_id: string, guid: string, user_id: number) => {
	logger.silly('Started db request', { function: 'canSwitch', obj: 'switchable', dir: 'start' });
	const switchable = (
		await db
			.select({ switch: BingoGame.allow_team_switching })
			.from(BingoGame)
			.where(eq(BingoGame.id, game_id))
	)[0].switch;
	logger.silly('Finished db request', { function: 'canSwitch', obj: 'switchable', dir: 'end' });
	if (!switchable) return false;

	logger.silly('Started db request', { function: 'canSwitch', obj: 'gameuser', dir: 'start' });
	const gu = await db
		.select({ id: GameUser.id })
		.from(GameUser)
		.where(and(eq(GameUser.user_id, user_id), eq(GameUser.game_id, game_id)));
	logger.silly('Finished db request', { function: 'canSwitch', obj: 'gameuser', dir: 'end' });
	if (gu.length != 1) return false;
	return gu[0].id == guid;
};

export const updateGameSettings = async (game_id: string, settings: Bingo.SettingsUpdate) => {
	logger.silly('Started db request', {
		function: 'updateGameSettings',
		obj: 'query',
		dir: 'start'
	});
	const q = (
		await db.update(BingoGame).set(settings).where(eq(BingoGame.id, game_id)).returning()
	)[0];
	logger.silly('Finished db request', { function: 'updateGameSettings', obj: 'query', dir: 'end' });
	if (!q) return null;
	return q;
};
