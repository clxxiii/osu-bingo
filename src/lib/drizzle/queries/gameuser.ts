import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { BingoGame, GameUser, User } from '../schema';
import { logger } from '$lib/logger';

export const joinGame = async (
	game_id: string,
	user_id: number,
	team?: string
): Promise<Bingo.Card.FullUser | null> => {
	team = team ?? 'RED';

	logger.silly('Started db request', { function: 'joinGame', obj: 'test', dir: 'start' });
	const test = await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));
	logger.silly('Finished db request', { function: 'joinGame', obj: 'test', dir: 'end' });

	if (test.length != 0) {
		if (test[0].host || test[0].team_name == 'invited') {
			logger.silly('Started db request', { function: 'joinGame', obj: 'gameuser1', dir: 'start' });
			const gameuser = (
				await db
					.update(GameUser)
					.set({ team_name: team })
					.where(eq(GameUser.id, test[0].id))
					.returning()
			)[0];
			logger.silly('Finished db request', { function: 'joinGame', obj: 'gameuser1', dir: 'end' });

			logger.silly('Started db request', { function: 'joinGame', obj: 'user1', dir: 'start' });
			const user = (
				await db
					.select()
					.from(User)
					.where(and(eq(User.id, gameuser.user_id)))
			)[0];
			logger.silly('Finished db request', { function: 'joinGame', obj: 'user1', dir: 'end' });
			return { ...gameuser, user };
		}
		return null;
	}

	logger.silly('Started db request', { function: 'joinGame', obj: 'gameuser2', dir: 'start' });
	const gameuser = (
		await db
			.insert(GameUser)
			.values({
				game_id,
				user_id,
				team_name: team
			})
			.returning()
	)[0];
	logger.silly('Finished db request', { function: 'joinGame', obj: 'gameuser2', dir: 'end' });

	logger.silly('Started db request', { function: 'joinGame', obj: 'user2', dir: 'start' });
	const user = (
		await db
			.select()
			.from(User)
			.where(and(eq(User.id, gameuser.user_id)))
	)[0];
	logger.silly('Finished db request', { function: 'joinGame', obj: 'user2', dir: 'end' });
	return { ...gameuser, user };
};

export const leaveGame = async (
	game_id: string,
	user_id: number
): Promise<Bingo.Card.FullUser | null> => {
	logger.silly('Started db request', { function: 'leaveGame', obj: 'test', dir: 'start' });
	const test = await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));
	logger.silly('Finished db request', { function: 'leaveGame', obj: 'test', dir: 'end' });

	if (test.length == 0 || test.length > 1) return null;

	// Do not remove users that are hosts
	if (test[0].host) {
		logger.silly('Started db request', { function: 'leaveGame', obj: 'gameuser1', dir: 'start' });
		const gameuser = (
			await db
				.update(GameUser)
				.set({
					team_name: 'none'
				})
				.where(eq(GameUser.id, test[0].id))
				.returning()
		)[0];
		logger.silly('Finished db request', { function: 'leaveGame', obj: 'gameuser1', dir: 'end' });

		logger.silly('Started db request', { function: 'leaveGame', obj: 'user1', dir: 'start' });
		const user = (
			await db
				.select()
				.from(User)
				.where(and(eq(User.id, gameuser.user_id)))
		)[0];
		logger.silly('Finished db request', { function: 'leaveGame', obj: 'user1', dir: 'end' });
		return { ...gameuser, user };
	}

	const is_public = (
		await db
			.select({ is_public: BingoGame.public })
			.from(BingoGame)
			.where(eq(BingoGame.id, game_id))
	)[0].is_public;

	// Keep user access to the game if they leave a private game.
	if (!is_public) {
		logger.silly('Started db request', { function: 'leaveGame', obj: 'gameuser2', dir: 'start' });
		const gameuser = (
			await db
				.update(GameUser)
				.set({ team_name: 'invited' })
				.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)))
				.returning()
		)[0];
		logger.silly('Finished db request', { function: 'leaveGame', obj: 'gameuser2', dir: 'end' });

		logger.silly('Started db request', { function: 'leaveGame', obj: 'user2', dir: 'start' });
		const user = (
			await db
				.select()
				.from(User)
				.where(and(eq(User.id, gameuser.user_id)))
		)[0];
		logger.silly('Finished db request', { function: 'leaveGame', obj: 'user2', dir: 'end' });
		return { ...gameuser, user };
	}

	logger.silly('Started db request', { function: 'leaveGame', obj: 'gameuser3', dir: 'start' });
	const gameuser = (
		await db
			.delete(GameUser)
			.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)))
			.returning()
	)[0];
	logger.silly('Finished db request', { function: 'leaveGame', obj: 'gameuser3', dir: 'end' });

	logger.silly('Started db request', { function: 'leaveGame', obj: 'user3', dir: 'start' });
	const user = (
		await db
			.select()
			.from(User)
			.where(and(eq(User.id, gameuser.user_id)))
	)[0];
	logger.silly('Finished db request', { function: 'leaveGame', obj: 'user3', dir: 'end' });
	return { ...gameuser, user };
};

export const switchTeams = async (guid: string, team: string) => {
	logger.silly('Started db request', { function: 'switchTeams', obj: 'gameuser', dir: 'start' });
	const gameuser = (
		await db
			.update(GameUser)
			.set({
				team_name: team
			})
			.where(eq(GameUser.id, guid))
			.returning()
	)[0];
	logger.silly('Finished db request', { function: 'switchTeams', obj: 'gameuser', dir: 'end' });
	if (!gameuser) return null;

	logger.silly('Started db request', { function: 'switchTeams', obj: 'user', dir: 'start' });
	const user = (
		await db
			.select()
			.from(User)
			.where(and(eq(User.id, gameuser.user_id)))
	)[0];
	logger.silly('Finished db request', { function: 'switchTeams', obj: 'user', dir: 'end' });
	return { ...gameuser, user };
};

export const getFullUser = async (
	game_id: string,
	user_id: number
): Promise<Bingo.Card.FullUser | null> => {
	logger.silly('Started db request', { function: 'getFullUser', obj: 'gameuser', dir: 'start' });
	const gameuser = (
		await db
			.select()
			.from(GameUser)
			.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)))
	)[0];
	logger.silly('Finished db request', { function: 'getFullUser', obj: 'gameuser', dir: 'end' });
	if (!gameuser) return null;

	logger.silly('Started db request', { function: 'getFullUser', obj: 'user', dir: 'start' });
	const user = (
		await db
			.select()
			.from(User)
			.where(and(eq(User.id, gameuser.user_id)))
	)[0];
	logger.silly('Finished db request', { function: 'getFullUser', obj: 'user', dir: 'end' });
	return { ...gameuser, user };
};

export const setHost = async (
	game_id: string,
	user_id: number,
	host?: boolean
): Promise<Bingo.Card.FullUser | null> => {
	logger.silly('Started db request', { function: 'setHost', obj: 'gameuser', dir: 'start' });
	const gameuser = (
		await db
			.update(GameUser)
			.set({
				host: host ?? true
			})
			.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)))
			.returning()
	)[0];
	logger.silly('Finished db request', { function: 'setHost', obj: 'gameuser', dir: 'end' });
	if (!gameuser) return null;

	logger.silly('Started db request', { function: 'setHost', obj: 'user', dir: 'start' });
	const user = (
		await db
			.select()
			.from(User)
			.where(and(eq(User.id, gameuser.user_id)))
	)[0];
	logger.silly('Finished db request', { function: 'setHost', obj: 'user', dir: 'end' });
	return { ...gameuser, user };
};

export const isHost = async (game_id: string, user_id: number) => {
	logger.silly('Started db request', { function: 'isHost', obj: 'gameuser', dir: 'start' });
	const gu = await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));
	logger.silly('Finished db request', { function: 'isHost', obj: 'gameuser', dir: 'end' });

	if (gu.length == 0) return false;
	return gu[0].host;
};

export const setInvited = async (
	game_id: string,
	user_id: number
): Promise<Bingo.Card.FullUser | null> => {
	logger.silly('Started db request', { function: 'setInvited', obj: 'test', dir: 'start' });
	const test = await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));
	logger.silly('Finished db request', { function: 'setInvited', obj: 'test', dir: 'end' });

	if (test.length != 0) return null;

	logger.silly('Started db request', { function: 'setInvited', obj: 'gameuser', dir: 'start' });
	const gameuser = (
		await db
			.insert(GameUser)
			.values({
				game_id,
				user_id,
				team_name: 'invited'
			})
			.returning()
	)[0];
	logger.silly('Finished db request', { function: 'setInvited', obj: 'gameuser', dir: 'end' });

	logger.silly('Started db request', { function: 'setInvited', obj: 'user', dir: 'start' });
	const user = (
		await db
			.select()
			.from(User)
			.where(and(eq(User.id, gameuser.user_id)))
	)[0];
	logger.silly('Finished db request', { function: 'setInvited', obj: 'user', dir: 'end' });
	return { ...gameuser, user };
};

export const isInvited = async (game_id: string, user_id: number): Promise<boolean> => {
	logger.silly('Started db request', { function: 'isInvited', obj: 'gameuser', dir: 'start' });
	const gu = await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));
	logger.silly('Finished db request', { function: 'isInvited', obj: 'gameuser', dir: 'end' });

	if (gu.length == 0) return false;
	return true;
};

export const getGameUser = async (guid: string) => {
	logger.silly('Started db request', { function: 'getGameUser', obj: 'gameuser', dir: 'start' });
	const gu = (await db.select().from(GameUser).where(eq(GameUser.id, guid)))[0];
	logger.silly('Finished db request', { function: 'getGameUser', obj: 'gameuser', dir: 'end' });
	return gu;
};
