import { eq } from 'drizzle-orm';
import { db } from '..';
import { Session, User } from '../schema';
import * as jose from 'jose';
import { JWT_SECRET } from '$lib/server/env';
import { logger } from '$lib/logger';

const jwt_alg = 'HS256';
const jwt_secret = new TextEncoder().encode(JWT_SECRET);

export const createSession = async (user_id: number) => {
	logger.silly("Started db request", { "function": "createSession", "obj": "userCheck", "dir": "start" })
	const userCheck = await db.select({ id: User.id }).from(User).where(eq(User.id, user_id));
	logger.silly("Finished db request", { "function": "createSession", "obj": "userCheck", "dir": "end" })
	if (userCheck.length == 0) {
		return null;
	}

	const token = await new jose.SignJWT({
		user_id: user_id
	})
		.setIssuedAt()
		.setProtectedHeader({ alg: jwt_alg })
		.sign(jwt_secret);

	logger.silly("Started db request", { "function": "createSession", "obj": "insert", "dir": "start" })
	const insert = (
		await db
			.insert(Session)
			.values({
				user_id: user_id,
				token
			})
			.returning()
	)[0];
	logger.silly("Finished db request", { "function": "createSession", "obj": "insert", "dir": "end" })
	return insert;
};

export const deleteSession = async (token: string) => {
	logger.silly("Started db request", { "function": "deleteSession", "obj": "delete", "dir": "start" })
	await db.delete(Session).where(eq(Session.token, token));
	logger.silly("Finished db request", { "function": "deleteSession", "obj": "delete", "dir": "end" })
};
