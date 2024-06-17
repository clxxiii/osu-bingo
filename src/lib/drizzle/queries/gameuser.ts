import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { GameUser } from '../schema';

export const joinGame = async (game_id: string, user_id: number, team: string) => {
	const test = await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));
	if (test.length != 0) {
		return (
			await db
				.update(GameUser)
				.set({ team_name: team })
				.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)))
				.returning()
		)[0];
	}

	return (
		await db
			.insert(GameUser)
			.values({
				game_id,
				user_id,
				team_name: team
			})
			.returning()
	)[0];
};

export const leaveGame = async (game_id: string, user_id: number) => {
	await db
		.delete(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));
};
