/**
 * Takes an osu score and the current claim condition, and determines whether
 * it has the ability to claim a square or not.
 *
 * Check https://notes.clxxiii.dev/1b23f4b9c82c800499bbd95c9fccbbab#1b23f4b9c82c80e58c76eb659a56e4d1 for more info
 */

import type { Options } from '$lib/gamerules/options';
import type { Osu } from '$lib/osu';

type Evaluator = (score: Osu.LazerScore, quantifier?: "lt" | "gt" | "eq", value?: string) => boolean;

const evaluators: { [key: string]: Evaluator } = {
	fc: (score) => (evaluators["pass"](score) && score.is_perfect_combo),
	rank: (score, q, value) => {
		if (!q || !value) return false;

		const hierarchy = ['SSH', 'SS', 'SH', 'S', 'A', 'B', 'C', 'D', 'F'];
		const scoreRank = hierarchy.indexOf(score.rank.toUpperCase() ?? 'F');
		const testRank = hierarchy.indexOf(value.toUpperCase() ?? 'F');

		return evaluators["pass"](score) && quantify(testRank, q, scoreRank);
	},
	pp: (score, q, value) => {
		if (!q || !value) return false;

		const pp = score.pp ?? 0;
		const target = parseFloat(value);

		return evaluators["pass"](score) && quantify(pp, q, target);
	},
	accuracy: (score, q, value) => {
		if (!q || !value) return false;

		const pp = (score.accuracy ?? 0) * 100;
		const target = parseFloat(value);

		return evaluators["pass"](score) && quantify(pp, q, target);
	},
	miss: (score, q, value) => {
		if (!q || !value) return false;

		const miss = score.statistics.miss ?? 0;
		const target = parseInt(value);

		return evaluators["pass"](score) && quantify(miss, q, target);
	},
	combo: (score, q, value) => {
		if (!q || !value) return false;
		const combo = score.max_combo;
		const target = parseInt(value);

		return evaluators["pass"](score) && quantify(combo, q, target);
	},
	score: (score, q, value) => {
		if (!q || !value) return false;

		const total_score = score.total_score;
		const target = parseInt(value);

		return evaluators["pass"](score) && quantify(total_score, q, target);
	},
	pass: (score) => {
		if (!score.passed) return false;
		return !score.mods.map((x) => x.acronym).includes('NF');
	},
	any: () => true
};

const quantify = (n1: number, q: "lt" | "gt" | "eq", n2: number) => {
	if (q == "gt") {
		return n1 >= n2;
	} else if (q == "lt") {
		return n1 < n2;
	}

	return n1 == n2;
}

export const isClaimworthy = (score: Osu.LazerScore, claim_condition: Options.ClaimCondition) => {

	let evaluator = evaluators[claim_condition.metric];
	if (!evaluator) evaluator = evaluators['fc'];

	return evaluator(score, claim_condition.quantifier, claim_condition.value);
};
