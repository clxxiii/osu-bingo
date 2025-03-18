import q from '$lib/drizzle/queries';
import { sendToGame } from '$lib/emitter/server';
import { logger } from '$lib/logger';

/**
 * This event instantly ends the game, and decides the winner based on the
 * following tiebreaker conditions:
 * - Counts each claimed square as one point, and whoever has the most points wins.
 * - If that count is a tie, each square is counted as it's claiming score
 *   number of points, and that score wins.
 */
export const finalCall = async (game_id: string) => {
	const game = await q.getGame(game_id);
	if (!game) return;
	if (!game.squares) return;

	const square_map = new Map<string, Bingo.Card.FullSquare[]>();

	for (const square of game.squares) {
		const team = square.claimed_by?.team_name;
		if (team) {
			let team_squares = square_map.get(team);
			if (!team_squares) team_squares = [];
			team_squares.push(square);
			square_map.set(team, team_squares);
		}
	}

	const count = []
	for (const [team, value] of square_map.entries()) {
		count.push({
			team,
			count: value.length ?? 0
		})
	}

	// If no claims, tie
	if (count.length == 0) {
		logger.info(`Game ${game_id} had no scores set on final call`, {
			game,
			type: "final_call_no_scores"
		});
		q.setGameState(game_id, 2);
		sendToGame(game_id, {
			type: 'state',
			data: {
				state: 2
			}
		});
		return;
	}

	// Check that there is no tie in square count
	count.sort((a, b) => b.count - a.count)

	const winners = [];
	const count_0 = count[0].count;
	for (const { team, count: score } of count) {
		if (score == count_0) winners.push({ team, count: score });
	}

	if (winners.length == 1) {
		const { team } = count[0];

		logger.info(`Game ${game_id} resulted in a final call tiebreaker, won by ${team}`, {
			type: "final_call_square_win",
			...game,
			count
		});
		q.setGameState(game_id, 2, team);
		sendToGame(game_id, {
			type: 'state',
			data: {
				state: 2,
				winner: team
			}
		});
		return;
	}

	/**
	 * If there is a tie in square count, we get the sum of all the squares'
	 * claiming scores and the higher sum wins.
	 */
	const scores: { team: string; sum: number }[] = [];
	for (const { team } of winners) {
		const value = square_map.get(team);
		if (!value) continue;

		let sum = 0;
		for (const square of value) {
			sum += getClaimingScore(square);
		}
		scores.push({ team, sum });
	}

	// Check that there is no tie in score
	scores.sort((a, b) => b.sum - a.sum)

	const scoreWinners = [];
	const score_0 = scores[0].sum;
	for (const { team, sum: score } of scores) {
		if (score == score_0) scoreWinners.push({ team, sum: score });
	}

	if (scoreWinners.length == 1) {
		const { team } = count[0];

		logger.info(
			`Game ${game_id} resulted in a final call score tiebreaker, won by ${team}`,
			{
				type: "final_call_score_win",
				game,
				count: scores
			}
		);
		q.setGameState(game_id, 2, team);
		sendToGame(game_id, {
			type: 'state',
			data: {
				state: 2,
				winner: team
			}
		});
		return;
	}

	// Ultimate Tie
	logger.info(`Game ${game_id} resulted in a final call tie`, {
		type: "final_call_ultimate_tie",
		count: scores,
		game
	});
	q.setGameState(game_id, 2);
	sendToGame(game_id, {
		type: 'state',
		data: {
			state: 2
		}
	});
};

const getClaimingScore = (square: Bingo.Card.FullSquare): number => {
	let max_score = 0;
	for (const score of square.scores) {
		if (!score.important) continue;
		if (score.score > max_score) max_score = score.score;
	}

	return max_score;
};
