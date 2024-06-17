import { eq } from 'drizzle-orm';
import { db } from '..';
import { Session, User } from '../schema';
import * as jose from 'jose';
import { JWT_SECRET } from '$env/static/private';

const jwt_alg = 'HS256';
const jwt_secret = new TextEncoder().encode(JWT_SECRET);

export const createSession = async (user_id: number) => {
	const userCheck = await db.select({ id: User.id }).from(User).where(eq(User.id, user_id));
	if (userCheck.length == 0) {
		return null;
	}

	const token = await new jose.SignJWT({
		user_id: user_id
	})
		.setIssuedAt()
		.setProtectedHeader({ alg: jwt_alg })
		.sign(jwt_secret);

	return (
		await db
			.insert(Session)
			.values({
				user_id: user_id,
				token
			})
			.returning()
	)[0];
};

export const deleteSession = async (token: string) => {
	await db.delete(Session).where(eq(Session.token, token));
};
