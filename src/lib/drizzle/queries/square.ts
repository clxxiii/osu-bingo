import { eq } from 'drizzle-orm';
import { db } from '..';
import { BingoSquare } from '../schema';
import { logger } from '$lib/logger';

export const setClaimer = async (square_id: string, game_user_id: string) => {
	logger.silly('Started db request', { function: 'setClaimer', obj: 'update', dir: 'start' });
	await db
		.update(BingoSquare)
		.set({ claimed_by_id: game_user_id })
		.where(eq(BingoSquare.id, square_id));
	logger.silly('Finished db request', { function: 'setClaimer', obj: 'update', dir: 'end' });
};

export const newSquare = async (square: typeof BingoSquare.$inferInsert) => {
	logger.silly('Started db request', { function: 'newSquare', obj: 'insert', dir: 'start' });
	const insert = (await db.insert(BingoSquare).values(square).returning())[0];
	logger.silly('Finished db request', { function: 'newSquare', obj: 'insert', dir: 'end' });
	return insert;
};
