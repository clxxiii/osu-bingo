import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { GameUser, User } from '../schema';

export const joinGame = async (game_id: string, user_id: number, team: string): Promise<Bingo.Card.FullUser | null> => {
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
				team_name: team
			})
			.returning()
	)[0];
	const user = (await db.select().from(User).where(and(eq(User.id, gameuser.user_id))))[0]
	return { ...gameuser, user }
};

export const leaveGame = async (game_id: string, user_id: number): Promise<Bingo.Card.FullUser> => {
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