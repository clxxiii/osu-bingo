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

	const count = square_map
		.keys()
		.map((x) => ({ team: x, count: square_map.get(x)?.length ?? 0 }))
		.toArray();
	console.log({ square_map, count });

	// If no claims, tie
	if (count.length == 0) {
		logger.info(`Game ${game_id} had no scores set on final call`, game);
		q.setGameState(game_id, 2);
		sendToGame(game_id, {
			type: 'state',
			data: {
				state: 2
			}
		});
		return;
	}

	let total_claimed = 0;
	for (const team of count) {
		total_claimed += team.count;
	}

	// Check that there is no tie
	if (total_claimed / count.length != count[0].count) {
		let winning_team = '';
		let highest_score = 0;
		for (const score of count) {
			if (score.count > highest_score) {
				highest_score = score.count;
				winning_team = score.team;
			}
		}

		logger.info(`Game ${game_id} resulted in a final call tiebreaker, won by ${winning_team}`, {
			...game,
			count
		});
		q.setGameState(game_id, 2, winning_team);
		sendToGame(game_id, {
			type: 'state',
			data: {
				state: 2,
				winner: winning_team
			}
		});
		return;
	}

	/**
	 * If there is a tie in square count, we get the sum of all the squares'
	 * claiming scores and the higher sum wins.
	 */
	const score_map: { team: string; sum: number }[] = [];
	for (const team of square_map.keys()) {
		let sum = 0;
		for (const square of square_map.get(team)!) {
			sum += getClaimingScore(square);
		}
		score_map.push({ team, sum });
	}

	let total_score = 0;
	for (const team of score_map) {
		total_score += team.sum;
	}

	// Check there is no tie in score
	if (total_score / score_map.length != score_map[0].sum) {
		let winning_team = '';
		let highest_score = 0;
		for (const score of score_map) {
			if (score.sum > highest_score) {
				highest_score = score.sum;
				winning_team = score.team;
			}
		}

		logger.info(
			`Game ${game_id} resulted in a final call score tiebreaker, won by ${winning_team}`,
			{ ...game, count: score_map }
		);
		q.setGameState(game_id, 2, winning_team);
		sendToGame(game_id, {
			type: 'state',
			data: {
				state: 2,
				winner: winning_team
			}
		});
		return;
	}

	// Ultimate Tie
	logger.info(`Game ${game_id} resulted in a final call tie`, game);
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
