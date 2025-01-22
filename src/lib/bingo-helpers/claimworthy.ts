/**
 * Takes an osu score and the current claim condition, and determines whether
 * it has the ability to claim a square or not.
 *
 * Currently supported conditions:
 * - 'fc': Claimable if the score is an FC
 * - 'rank_*': Claimable if the grade is *at least* the specified letter
 * - 'pp_*': Claimable if the score has at least the specified amount of pp
 * - 'miss_*': Claimable if the score has less than the specified amount of misses
 * - 'combo_*': Claimable if the score has at least the specified combo
 * - 'score_*': Claimable if the score has at least the specified score
 * - 'pass': Claimable if the user passed (without NF)
 * - 'any': All scores are claimable (even fails)
 */

import type { Osu } from '$lib/osu';

type Evaluator = {
	display_string: (value: string) => string;
	evaluate: (score: Osu.LazerScore, value: string) => boolean;
};

const evaluators: { [key: string]: Evaluator } = {
	fc: {
		display_string: () => 'FC',
		evaluate: (score) => evaluators["pass"].evaluate(score, "") && score.is_perfect_combo
	},
	rank: {
		display_string: (value) => `${value.toUpperCase()} rank or higher`,
		evaluate: (score, value) => {
			const hierarchy = ['SSH', 'SS', 'SH', 'S', 'A', 'B', 'C', 'D', 'F'];
			const scoreRank = hierarchy.indexOf(score.rank.toUpperCase() ?? 'F');
			const testRank = hierarchy.indexOf(value.toUpperCase() ?? 'F');

			return evaluators["pass"].evaluate(score, value) && (scoreRank <= testRank);
		}
	},
	pp: {
		display_string: (value) => `${parseFloat(value).toLocaleString()}pp or higher`,
		evaluate: (score, value) => {
			const pp = score.pp ?? 0;
			const target = parseFloat(value);

			return evaluators["pass"].evaluate(score, value) && (pp >= target);
		}
	},
	miss: {
		display_string: (value) => `${parseInt(value).toLocaleString()} misses or fewer`,
		evaluate: (score, value) => {
			const miss = score.statistics.miss ?? 0;
			const target = parseInt(value);

			return evaluators["pass"].evaluate(score, value) && (miss <= target);
		}
	},
	combo: {
		display_string: (value) => `${parseInt(value).toLocaleString()} combo or more`,
		evaluate: (score, value) => {
			const combo = score.max_combo;
			const target = parseInt(value);

			return evaluators["pass"].evaluate(score, value) && (combo >= target);
		}
	},
	score: {
		display_string: (value) => `${parseInt(value).toLocaleString()} or more`,
		evaluate: (score, value) => {
			const total_score = score.total_score;
			const target = parseInt(value);

			return evaluators["pass"].evaluate(score, value) && (total_score >= target);
		}
	},
	pass: {
		display_string: () => 'Pass',
		evaluate: (score) => {
			if (!score.passed) return false;
			return !score.mods.map((x) => x.acronym).includes('NF');
		}
	},
	any: {
		display_string: () => 'None',
		evaluate: () => true
	}
};

export const isClaimworthy = (score: Osu.LazerScore, claim_condition: string) => {
	const [type] = claim_condition.split('_');
	const value = claim_condition.split('_').slice(1).join('_');

	let evaluator = evaluators[type];
	if (!evaluator) evaluator = evaluator['fc'];

	return evaluator.evaluate(score, value);
};

export const getMeaning = (claim_condition: string) => {
	const [type] = claim_condition.split('_');
	const value = claim_condition.split('_').slice(1).join('_');

	let evaluator = evaluators[type];
	if (!evaluator) evaluator = evaluators['fc'];

	return evaluator.display_string(value);
};
