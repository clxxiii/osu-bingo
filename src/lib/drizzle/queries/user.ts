import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { BingoGame, GameUser, Session, User } from '../schema';
import { env } from '$env/dynamic/private';
import { getMe, refreshOAuthToken } from '$lib/server/osu';
import { logger } from '$lib/logger';
import { deleteToken, getToken, setToken } from './token';

export const setUser = async (user: typeof User.$inferInsert) => {
	if (user.id == null) {
		return;
	}

	logger.silly("Started db request", { "function": "setUser", "obj": "userObj", "dir": "start" })
	const userObj = await db.select({ id: User.id }).from(User).where(eq(User.id, user.id));
	logger.silly("Finished db request", { "function": "setUser", "obj": "userObj", "dir": "end" })
	if (userObj.length == 0) {
		logger.silly("Started db request", { "function": "setUser", "obj": "userInsert", "dir": "start" })
		const userInsert = (await db.insert(User).values(user).returning())[0];
		logger.silly("Finished db request", { "function": "setUser", "obj": "userInsert", "dir": "end" })
		return userInsert;
	}

	const newUser = {
		last_refreshed: new Date(),
		...user
	};

	logger.silly("Started db request", { "function": "setUser", "obj": "userUpdate", "dir": "start" })
	const userUpdate = (await db.update(User).set(newUser).where(eq(User.id, user.id)).returning())[0];
	logger.silly("Finished db request", { "function": "setUser", "obj": "userUpdate", "dir": "end" })
	return userUpdate;
};

export const getUser = async (id: number) => {
	logger.silly("Started db request", { "function": "getUser", "obj": "user", "dir": "start" })
	const user = (await db.select().from(User).where(eq(User.id, id)))[0];
	logger.silly("Finished db request", { "function": "getUser", "obj": "user", "dir": "end" })
	return user;
};

export const getUserFromSessionToken = async (token: string) => {
	logger.silly("Started db request", { "function": "getUserFromSessionToken", "obj": "tokens", "dir": "start" })
	const tokens = await db
		.select()
		.from(Session)
		.where(eq(Session.token, token))
		.innerJoin(User, eq(User.id, Session.user_id));
	logger.silly("Finished db request", { "function": "getUserFromSessionToken", "obj": "tokens", "dir": "end" })

	// If there is no session with that token, token is invalid.
	if (tokens.length == 0) {
		return null;
	}
	//There should only be one
	return tokens[0].User;
};

export const isInGame = async (user_id: number) => {
	logger.silly("Started db request", { "function": "isInGame", "obj": "gameUser", "dir": "start" })
	const gameUser = (await db.select({
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
	logger.silly("Finished db request", { "function": "isInGame", "obj": "gameUser", "dir": "end" })
	return gameUser;
}

export const updateUser = async (token: Bingo.OauthToken) => {
	const response = await refreshOAuthToken(token, env.OSU_CLIENT_ID, env.OSU_CLIENT_SECRET);

	if (response == null) {
		logger.info(`Failed to update token, deleting...`, { type: 'token_update_failed' })
		deleteToken(token.id);
		return;
	}

	// Replace token in database
	setToken({
		access_token: response.access_token,
		refresh_token: response.refresh_token,
		expires_at: new Date(Date.now() + response.expires_in * 1000),
		service: 'osu',
		token_type: response.token_type,
		user_id: token.user_id
	})

	// Update user data
	const user = await getMe(response.access_token);

	if (user.statistics) {
		await setUser({
			id: user.id,

			username: user.username,
			country_code: user.country_code,
			country_name: user.country?.name ?? user.country_code,

			cover_url: user.cover?.url ?? '',
			avatar_url: user.avatar_url,

			pp: user.statistics.pp,

			global_rank: user.statistics.global_rank,
			country_rank: user.statistics.country_rank,

			total_score: user.statistics.total_score,
			ranked_score: user.statistics.ranked_score,
			hit_accuracy: user.statistics.hit_accuracy,
			play_count: user.statistics.play_count,
			level: user.statistics.level.current,
			level_progress: user.statistics.level.progress
		});

		logger.info(`Successfully updated user info for ${user.id} (${user.username}: #${user?.statistics?.global_rank?.toLocaleString()})`, { type: 'token_update' })
		return getToken(user.id, "osu");
	} else {
		logger.info(`Failed trying to update user info for token ${token.id} (${token.user_id})`, { type: 'token_update_failed' })
	}
}