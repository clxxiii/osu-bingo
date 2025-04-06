import { and, count, eq } from 'drizzle-orm';
import { db } from '..';
import { BingoGame, BingoSquare, Score } from '../schema';
import type { Osu } from '$lib/osu';
import { logger } from '$lib/logger';

export const getScores = async (user_id: number, square_id: string) => {
	logger.silly('Started db request', { function: 'getScores', obj: 'select', dir: 'start' });
	const select = await db
		.select()
		.from(Score)
		.where(and(eq(Score.user_id, user_id), eq(Score.square_id, square_id)));
	logger.silly('Finished db request', { function: 'getScores', obj: 'select', dir: 'end' });
	return select;
};

export const getScoresFromGame = async (game_id: string) => {
	logger.silly('Started db request', { function: 'getScoresFromGame', obj: 'select', dir: 'start' });
	const select = await db
		.select({ score_id: Score.score_id })
		.from(BingoGame)
		.innerJoin(BingoSquare, eq(BingoSquare.game_id, BingoGame.id))
		.innerJoin(Score, eq(Score.square_id, BingoSquare.id))
		.where(eq(BingoGame.id, game_id))
	logger.silly('Started db request', { function: 'getScoresFromGame', obj: 'select', dir: 'end' });
	return select;
}

export const addScore = async (
	score: Osu.LazerScore,
	user: Bingo.Card.FullUser,
	square_id: string,
	claimworthy?: boolean,
	claim?: number
): Promise<Bingo.Card.FullScore> => {
	logger.silly('Started db request', { function: 'addScore', obj: 'dbScore', dir: 'start' });
	const dbScore = (
		await db
			.insert(Score)
			.values({
				score_id: score.id,
				lazer: !score.mods.map((x) => x.acronym).includes('CL'),
				date: new Date(score.ended_at ?? Date.now()),
				is_fc: score.is_perfect_combo,
				score: score.total_score,
				grade: score.passed ? score.rank : 'F',
				percentage: score.passed ? 1 : percentage(score),
				accuracy: score.accuracy,
				pp: score.pp,
				mods: score.mods
					.map((x) => x.acronym)
					.filter((x) => x != 'CL')
					.join(''),
				max_combo: score.max_combo,
				square_id,
				claimworthy,
				claim,
				user_id: score.user_id,
				game_user_id: user.id
			})
			.returning()
	)[0];
	logger.silly('Finished db request', { function: 'addScore', obj: 'dbScore', dir: 'end' });

	return { ...dbScore, user };
};

const percentage = (score: Osu.LazerScore) => {
	const hits =
		(score.statistics.miss ?? 0) +
		(score.statistics.ok ?? 0) +
		(score.statistics.meh ?? 0) +
		(score.statistics.great ?? 0);

	const total_hits = score.maximum_statistics?.great;

	if (!hits || !total_hits) return null;

	return hits / total_hits;
};
