import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { BingoGame, GameUser, Session, User } from '../schema';
import { PUBLIC_OSU_CLIENT_ID } from '$env/static/public';
import { OSU_CLIENT_SECRET } from '$env/static/private';
import { getMe, refreshOAuthToken } from '$lib/server/osu';
import { logger } from '$lib/logger';
import { deleteToken, getToken, setToken } from './token';

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

export const updateUser = async (token: Bingo.OauthToken) => {
	const response = await refreshOAuthToken(token, PUBLIC_OSU_CLIENT_ID, OSU_CLIENT_SECRET);

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