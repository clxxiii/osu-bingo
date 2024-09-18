/**
 * Takes a square and gets the best score on it depending on the
 * game's sorting method.
 */
const evaluators: { [key: string]: (scores: Bingo.Score[]) => Bingo.Score } = {
	score: (scores) => scores.sort((a, b) => b.score - a.score)[0],
	accuracy: (scores) => scores.sort((a, b) => b.accuracy - a.accuracy)[0],
	combo: (scores) => scores.sort((a, b) => b.max_combo - a.max_combo)[0],
	pp: (scores) => scores.sort((a, b) => (b.pp ?? 0) - (a.pp ?? 0))[0]
};

export const getBest = (square: Bingo.Card.FullSquare, tiebreaker: string) => {
	let evaluator = evaluators[tiebreaker];
	if (!evaluator) evaluator = evaluator['score'];

	const scores = square.scores.filter((x) => x.important);
	return evaluator(scores);
};

export const scoreBeatsBest = (
	square: Bingo.Card.FullSquare,
	next: Bingo.Score,
	tiebreaker: string
) => {
	let evaluator = evaluators[tiebreaker];
	if (!evaluator) evaluator = evaluator['score'];

	const scores: Bingo.Score[] = square.scores.filter((x) => x.important);
	if (scores.length == 0) return true;

	const currentBest = evaluator(scores);
	scores.push(next);
	const nextBest = evaluator(scores);

	return nextBest.id != currentBest.id;
};
