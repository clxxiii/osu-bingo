import { and, eq, not, or } from 'drizzle-orm';
import { db } from '..';
import {
	BingoGame,
	BingoSquare,
	GameUser,
	Map,
	MapStats,
	Score,
	TimeEvent,
	User
} from '../schema';
import { getTemplate } from './template';

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
		const duplicate = await db
			.select()
			.from(BingoGame)
			.where(and(eq(BingoGame.link_id, link_id), eq(BingoGame.state, 0)));
		if (duplicate.length == 0) break;
	}

	return (
		await db
			.insert(BingoGame)
			.values({
				link_id
			})
			.returning()
	)[0];
};

export const getGame = async (game_id: string): Promise<Bingo.Card | null> => {
	const game = (await db.select().from(BingoGame).where(eq(BingoGame.id, game_id)))[0];
	if (!game) return null;

	const users: Bingo.Card.FullUser[] = [];
	const gameusers = await db
		.select()
		.from(GameUser)
		.where(and(
			eq(GameUser.game_id, game_id),
			not(eq(GameUser.team_name, "none")),
			not(eq(GameUser.team_name, "invited"))
		))
	for (const gameuser of gameusers) {
		const user = (await db.select().from(User).where(and(eq(User.id, gameuser.user_id))))[0]
		users.push({ ...gameuser, user })
	}

	const hosts = (await db
		.select({ user: User })
		.from(GameUser)
		.innerJoin(User, eq(GameUser.user_id, User.id))
		.where(and(
			eq(GameUser.game_id, game.id),
			eq(GameUser.host, true)
		))).map(x => x.user)

	const events = await db.select().from(TimeEvent).where(eq(TimeEvent.game_id, game_id));
	const template = await getTemplate(game.template_id);

	if (game.state == 0) return { ...game, users, events, squares: null, hosts, template };

	const squares: Bingo.Card.FullSquare[] = [];
	const dbSquares = await db.select().from(BingoSquare).where(eq(BingoSquare.game_id, game_id));
	for (const square of dbSquares) {
		const map = (
			await db
				.select()
				.from(Map)
				.innerJoin(MapStats, eq(MapStats.map_id, Map.id))
				.where(and(eq(Map.id, square.map_id), eq(MapStats.mod_string, square.mod_string ?? '')))
		)[0];

		const scores: Bingo.Card.FullScore[] = [];
		const dbScores = await db.select().from(Score).where(eq(Score.square_id, square.id));
		for (const score of dbScores) {
			const user = users.find(x => x.user_id == score.user_id);
			if (!user) continue
			scores.push({ ...score, user })
		}

		let claimed_by: Bingo.GameUser | null = null;
		if (square.claimed_by_id) {
			claimed_by = (await db
				.select()
				.from(GameUser)
				.where(eq(GameUser.id, square.claimed_by_id)))[0]
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
	const query = (
		await db
			.select({ game_id: BingoGame.id })
			.from(BingoGame)
			.where(and(eq(BingoGame.link_id, link), or(eq(BingoGame.state, 0), eq(BingoGame.state, 1))))
	)[0];
	if (query == undefined) return null;

	return query.game_id;
};

export const getGameFromLinkId = async (link: string) => {
	const game_id = await gameLinkToId(link);
	if (!game_id) return null;
	return await getGame(game_id);
};

export const setGameState = async (game_id: string, state: number, winning_team?: string) => {
	await db
		.update(BingoGame)
		.set({ state, winning_team })
		.where(eq(BingoGame.id, game_id))

	return state;
}

export const getCurrentGames = async () => {
	return await db
		.select({ id: BingoGame.id })
		.from(BingoGame)
		.where(eq(BingoGame.state, 1));
}

export const getAllGames = async () => {
	return await db
		.select()
		.from(BingoGame)
		.orderBy(BingoGame.state)
		.limit(10)
		.where(eq(BingoGame.public, true));
}

export const gameExists = async (game_id: string) => {
	const q = await db
		.select()
		.from(BingoGame)
		.where(eq(BingoGame.id, `gam_${game_id}`))
	if (q.length > 0) return `gam_${game_id}`
	return null
}

export const canSwitch = async (game_id: string, guid: string, user_id: number) => {
	const switchable = (await db.select({ switch: BingoGame.allow_team_switching })
		.from(BingoGame)
		.where(eq(BingoGame.id, game_id)))[0].switch;
	if (!switchable) return false;

	const gu = await db.select({ id: GameUser.id }).from(GameUser).where(and(eq(GameUser.user_id, user_id), eq(GameUser.game_id, game_id)))
	if (gu.length != 1) return false;
	return gu[0].id == guid;
}

export const updateGameSettings = async (game_id: string, settings: Bingo.SettingsUpdate) => {
	const q = (await db
		.update(BingoGame)
		.set(settings)
		.where(eq(BingoGame.id, game_id))
		.returning())[0]
	if (!q) return null;
	return q;
}