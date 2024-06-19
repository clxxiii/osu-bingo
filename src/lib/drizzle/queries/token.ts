import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { OauthToken } from '../schema';

export const setToken = async (token: typeof OauthToken.$inferInsert) => {
	if (!token.service) return;
	if (!token.user_id) return;

	const dbToken = await db.select().from(OauthToken).where(
		and(
			eq(OauthToken.user_id, token.user_id),
			eq(OauthToken.service, token.service)
		));
	if (dbToken.length != 0) {
		await db.update(OauthToken).set(token).where(eq(OauthToken.user_id, token.user_id));
	} else {
		await db.insert(OauthToken).values(token);
	}
};

export const getToken = async (user_id: number) => {
	return (await db.select().from(OauthToken).where(eq(OauthToken.user_id, user_id)))[0];
};

export const deleteToken = async (token_id: string) => {
	await db.delete(OauthToken).where(eq(OauthToken.id, token_id));
}