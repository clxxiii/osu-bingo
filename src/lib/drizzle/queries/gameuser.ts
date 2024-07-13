import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { BingoGame, GameUser, User } from '../schema';

export const joinGame = async (game_id: string, user_id: number, team?: string): Promise<Bingo.Card.FullUser | null> => {
	team = team ?? 'RED'

	const test = await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));

	if (test.length != 0) {
		if (test[0].host || test[0].team_name == 'invited') {
			const gameuser = (
				await db
					.update(GameUser)
					.set({ team_name: team })
					.where(eq(GameUser.id, test[0].id))
					.returning()
			)[0]
			const user = (await db.select().from(User).where(and(eq(User.id, gameuser.user_id))))[0]
			return { ...gameuser, user }
		}
		return null;
	};

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
	const user = (await db.select().from(User).where(and(eq(User.id, gameuser.user_id))))[0]
	return { ...gameuser, user }
};

export const leaveGame = async (game_id: string, user_id: number): Promise<Bingo.Card.FullUser | null> => {
	const test = await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));

	if (test.length == 0 || test.length > 1) return null;

	// Do not remove users that are hosts
	if (test[0].host) {
		const gameuser = (await db
			.update(GameUser)
			.set({
				team_name: 'none'
			})
			.where(eq(GameUser.id, test[0].id))
			.returning()
		)[0]
		const user = (await db.select().from(User).where(and(eq(User.id, gameuser.user_id))))[0]
		return { ...gameuser, user }
	}

	const is_public = (await db
		.select({ is_public: BingoGame.public })
		.from(BingoGame)
		.where(eq(BingoGame.id, game_id)))[0].is_public

	if (!is_public) {
		const gameuser = (await db
			.update(GameUser)
			.set({ team_name: 'invited' })
			.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)))
			.returning())[0];
		const user = (await db.select().from(User).where(and(eq(User.id, gameuser.user_id))))[0]
		return { ...gameuser, user }
	}

	const gameuser = (await db
		.delete(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)))
		.returning())[0];
	const user = (await db.select().from(User).where(and(eq(User.id, gameuser.user_id))))[0]
	return { ...gameuser, user }
};

export const getFullUser = async (game_id: string, user_id: number): Promise<Bingo.Card.FullUser | null> => {
	const gameuser = (await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id))))[0];
	if (!gameuser) return null;
	const user = (await db.select().from(User).where(and(eq(User.id, gameuser.user_id))))[0]
	return { ...gameuser, user }
}

export const setHost = async (game_id: string, user_id: number, host?: boolean): Promise<Bingo.Card.FullUser | null> => {
	const gameuser = (await db.update(GameUser).set({
		host: host ?? true
	})
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)))
		.returning())[0]
	if (!gameuser) return null;
	const user = (await db.select().from(User).where(and(eq(User.id, gameuser.user_id))))[0]
	return { ...gameuser, user }
}

export const setInvited = async (game_id: string, user_id: number): Promise<Bingo.Card.FullUser | null> => {
	const test = await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));

	if (test.length != 0) return null;

	const gameuser = (
		await db
			.insert(GameUser)
			.values({
				game_id,
				user_id,
				team_name: 'invited'
			})
			.returning()
	)[0]
	const user = (await db.select().from(User).where(and(eq(User.id, gameuser.user_id))))[0]
	return { ...gameuser, user }
}

export const isInvited = async (game_id: string, user_id: number): Promise<boolean> => {
	const gu = await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));

	if (gu.length == 0) return false;
	return true;
}