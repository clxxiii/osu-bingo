import { and, eq, lte } from 'drizzle-orm';
import { db } from '..';
import { OauthToken } from '../schema';
import { logger } from '$lib/logger';

export const setToken = async (token: typeof OauthToken.$inferInsert) => {
	if (!token.service) return;
	if (!token.user_id) return;

	logger.silly("Started db request", { "function": "setToken", "obj": "dbToken", "dir": "start" })
	const dbToken = await db.select().from(OauthToken).where(
		and(
			eq(OauthToken.user_id, token.user_id),
			eq(OauthToken.service, token.service)
		));
	logger.silly("Finished db request", { "function": "setToken", "obj": "dbToken", "dir": "end" })
	if (dbToken.length != 0) {
		logger.silly("Started db request", { "function": "setToken", "obj": "tokenUpdate", "dir": "start" })
		await db.update(OauthToken).set(token).where(eq(OauthToken.user_id, token.user_id));
		logger.silly("Finished db request", { "function": "setToken", "obj": "tokenUpdate", "dir": "end" })
	} else {
		logger.silly("Started db request", { "function": "setToken", "obj": "tokenInsert", "dir": "start" })
		await db.insert(OauthToken).values(token);
		logger.silly("Finished db request", { "function": "setToken", "obj": "tokenInsert", "dir": "end" })
	}
};

export const getLingeringTokens = async () => {
	const cutoff = new Date(Date.now() + 1000 * 60 * 5); // Find all tokens that expire in the next 5 minutes
	logger.silly("Started db request", { "function": "getLingeringTokens", "obj": "lingeringTokens", "dir": "start" })
	const lingeringTokens =
		await db
			.select()
			.from(OauthToken)
			.where(
				and(
					lte(OauthToken.expires_at, cutoff),
					eq(OauthToken.service, 'osu'),
				)
			)
	logger.silly("Finished db request", { "function": "getLingeringTokens", "obj": "lingeringTokens", "dir": "end" })
	return lingeringTokens;
}

export const getToken = async (user_id: number, service?: string) => {
	logger.silly("Started db request", { "function": "getToken", "obj": "token", "dir": "start" })
	const token = (await db
		.select()
		.from(OauthToken)
		.where(and(
			eq(OauthToken.user_id, user_id),
			eq(OauthToken.service, service ?? 'osu')
		)))[0];
	logger.silly("Finished db request", { "function": "getToken", "obj": "token", "dir": "end" })
	return token;
};

export const deleteToken = async (token_id: string) => {
	logger.silly("Started db request", { "function": "deleteToken", "obj": "delete", "dir": "start" })
	await db.delete(OauthToken).where(eq(OauthToken.id, token_id));
	logger.silly("Finished db request", { "function": "deleteToken", "obj": "delete", "dir": "end" })
}