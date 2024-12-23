import { and, desc, eq, or } from 'drizzle-orm';
import { db } from '..';
import { BingoGame, BingoSquare, GameUser, Map, MapStats, Score, Template, TimeEvent, User } from '../schema';
import { logger } from '$lib/logger';
import { getTemplate } from './template';
import { invitedTeam, kickedTeam, noneTeam } from './gameuser';

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

	// Get All game metadata in one request
	logger.silly('Started db request', { function: 'getGame', obj: 'game', dir: 'start' });
	const data = await db.select({
		game: BingoGame,
		template: Template,
		gameuser: GameUser,
		user: User,
		event: TimeEvent,
	}).from(BingoGame)
		.leftJoin(Template, eq(BingoGame.template_id, Template.id))
		.leftJoin(TimeEvent, eq(BingoGame.id, TimeEvent.game_id))
		.leftJoin(GameUser, eq(BingoGame.id, GameUser.game_id))
		.leftJoin(User, eq(GameUser.user_id, User.id))
		.where(eq(BingoGame.id, game_id));
	logger.silly('Finished db request', { function: 'getGame', obj: 'game', dir: 'end' });

	if (!data) return null;

	const game = data[0].game;

	let template = data[0].template;
	if (!template) {
		template = await getTemplate(null);
	}

	// To be filled with data from sql request
	const users: Bingo.Card.FullUser[] = [];
	const hosts: Bingo.User[] = [];
	const events: Bingo.TimeEvent[] = [];

	// Cache IDS we've already processed so we don't have to remake this list every loop
	const userIDs: number[] = [];
	const eventIDs: string[] = [];
	for (const line of data) {
		const { user, gameuser, event } = line;

		// We need a check like this because users appear multiple times (due to the nature of sql joins)
		if (user && gameuser && !userIDs.includes(user.id)) {
			userIDs.push(user.id)

			const fullUser = { ...gameuser, user };
			if (
				gameuser.team_name != noneTeam &&
				gameuser.team_name != invitedTeam &&
				gameuser.team_name != kickedTeam
			) {
				users.push(fullUser);
			}
			if (gameuser.host) {
				hosts.push(user);
			}
		}

		if (event && !eventIDs.includes(event.id)) {
			eventIDs.push(event.id);
			events.push(event);
		}
	}

	// Squares should be hidden if the game hasn't started yet (also they shouldn't exist but that's to a lesser point)
	if (game.state == 0) return { ...game, users, events, squares: null, hosts, template };

	logger.silly('Started db request', { function: 'getGame', obj: 'dbSquares', dir: 'start' });
	const dbSquares = await db
		.select({
			square: BingoSquare,
			map: Map,
			mapstats: MapStats,
			score: Score
		})
		.from(BingoSquare)
		.leftJoin(Map, eq(BingoSquare.map_id, Map.id))
		.leftJoin(MapStats, eq(Map.id, MapStats.map_id))
		.leftJoin(Score, eq(BingoSquare.id, Score.square_id))
		.where(and(
			eq(BingoSquare.game_id, game_id),
			eq(MapStats.mod_string, BingoSquare.mod_string ?? '')
		))
		.orderBy(BingoSquare.y_pos, BingoSquare.x_pos);
	logger.silly('Finished db request', { function: 'getGame', obj: 'dbSquares', dir: 'end' });

	const squares: Bingo.Card.FullSquare[] = [];
	const squareIDs: string[] = [];
	for (const { square, map, mapstats, score } of dbSquares) {
		if (!square || !map || !mapstats) continue;

		if (!squareIDs.includes(square.id)) {
			squareIDs.push(square.id);

			let claimed_by: Bingo.GameUser | null = null;
			if (square.claimed_by_id) {
				claimed_by = users.find(x => x.id == square.claimed_by_id) ?? null;
			}

			squares.push({
				...square,
				data: {
					...map,
					stats: mapstats
				},
				claimed_by,
				scores: [] // Start with array empty
			});
		}

		if (!score) continue;

		// Find the square it belongs to and push this score
		const squareIdx = squares.findIndex(x => x.id == score.square_id);
		const user = users.find((x) => x.user_id == score.user_id);
		if (!squareIdx || !user) continue;

		squares[squareIdx].scores.push({ ...score, user })
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

export const getAllGames = async (limit?: number) => {
	limit = limit ?? 10;
	logger.silly('Started db request', { function: 'getAllGames', obj: 'query', dir: 'start' });
	const query = await db
		.select()
		.from(BingoGame)
		.orderBy(BingoGame.state, desc(BingoGame.start_time))
		.limit(limit)
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
