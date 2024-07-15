import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { BingoGame, GameUser, Session, User } from '../schema';

export const setUser = async (user: typeof User.$inferInsert) => {
	if (user.id == null) {
		return;
	}

	const userObj = await db.select({ id: User.id }).from(User).where(eq(User.id, user.id));
	if (userObj.length == 0) {
		return (await db.insert(User).values(user).returning())[0];
	}

	const newUser = {
		last_refreshed: new Date(),
		...user
	};

	return (await db.update(User).set(newUser).where(eq(User.id, user.id)).returning())[0];
};

export const getUser = async (id: number) => {
	return (await db.select().from(User).where(eq(User.id, id)))[0];
};

export const getUserFromSessionToken = async (token: string) => {
	const tokens = await db
		.select()
		.from(Session)
		.where(eq(Session.token, token))
		.innerJoin(User, eq(User.id, Session.user_id));

	// If there is no session with that token, token is invalid.
	if (tokens.length == 0) {
		return null;
	}
	//There should only be one
	return tokens[0].User;
};

export const isInGame = async (user_id: number) => {
	return (await db.select({
		user_id: GameUser.user_id,
		game_id: BingoGame.id,
		guid: GameUser.id
	})
		.from(GameUser)
		.innerJoin(BingoGame, eq(GameUser.game_id, BingoGame.id))
		.where(and(
			eq(GameUser.user_id, user_id),
			eq(BingoGame.state, 1)
		)))[0]
}