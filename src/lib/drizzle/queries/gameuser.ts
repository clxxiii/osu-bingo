import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { GameUser } from '../schema';
import { emitter } from '..';
import { getGame } from './game';

export const joinGame = async (game_id: string, user_id: number, team: string) => {
	const test = await db
		.select()
		.from(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));
	if (test.length != 0) {
		const value = (
			await db
				.update(GameUser)
				.set({ team_name: team })
				.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)))
				.returning()
		)[0];
		emitter.emit(game_id, await getGame(game_id));
		return value;
	}

	const value = (
		await db
			.insert(GameUser)
			.values({
				game_id,
				user_id,
				team_name: team
			})
			.returning()
	)[0];
	emitter.emit(game_id, await getGame(game_id));
	return value;
};

export const leaveGame = async (game_id: string, user_id: number) => {
	await db
		.delete(GameUser)
		.where(and(eq(GameUser.game_id, game_id), eq(GameUser.user_id, user_id)));
	emitter.emit(game_id, await getGame(game_id));
};
