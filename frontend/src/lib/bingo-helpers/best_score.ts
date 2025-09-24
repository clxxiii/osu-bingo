/**
 * Takes a square and gets the best score on it depending on the
 * game's sorting method.
 */
const comparators: { [key: string]: (a: Bingo.Score, b: Bingo.Score) => number } = {
	score: (a, b) => b.score - a.score,
	accuracy: (a, b) => b.accuracy - a.accuracy,
	combo: (a, b) => b.max_combo - a.max_combo,
	pp: (a, b) => (b.pp ?? 0) - (a.pp ?? 0)
};

export const getBest = (square: Bingo.Card.FullSquare, tiebreaker: string) => {
	let evaluator = comparators[tiebreaker];
	if (!evaluator) evaluator = evaluator['score'];

	const scores = square.scores.filter((x) => x.claimworthy);
	return scores.sort(evaluator)[0];
};

export const scoreBeatsBest = (
	square: Bingo.Card.FullSquare,
	next: Bingo.Score,
	tiebreaker: string
) => {
	const evaluator = comparators[tiebreaker];
	if (!evaluator) return false;

	const scores: Bingo.Score[] = square.scores.filter((x) => x.claimworthy);
	if (scores.length == 0) return true;

	const currentBest = getBest(square, tiebreaker);

	return evaluator(currentBest, next) > 0;
};
