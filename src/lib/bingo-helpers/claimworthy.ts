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
 * - 'pass': Claimable if the user passed (without NF)
 * - 'any': All scores are claimable (even fails)
 */

import type { Osu } from "$lib/osu";

const evaluators: { [key: string]: (score: Osu.LazerScore, value: string) => boolean } = {
  'fc': (score) => score.is_perfect_combo,
  'rank': (score, value) => {
    const hierarchy = ['SSH', 'SS', 'SH', 'S', 'A', 'B', 'C', 'D', 'F'];
    const scoreRank = hierarchy.indexOf(score.rank.toUpperCase() ?? "F");
    const testRank = hierarchy.indexOf(value.toUpperCase() ?? "F");

    return scoreRank <= testRank;
  },
  'pp': (score, value) => {
    const pp = score.pp ?? 0;
    const target = parseFloat(value);

    return pp > target;
  },
  'miss': (score, value) => {
    const miss = score.statistics.miss ?? 0;
    const target = parseInt(value);

    return miss > target;
  },
  'combo': (score, value) => {
    const combo = score.max_combo
    const target = parseInt(value);

    return combo > target;
  },
  'pass': (score) => {
    if (!score.passed) return false;
    return !score.mods.map((x) => x.acronym).includes('NF')
  },
  'any': () => true
}

export const isClaimworthy = (score: Osu.LazerScore, claim_condition: string) => {
  const [type, value] = claim_condition.split("_");

  let evaluator = evaluators[type];
  if (!evaluator) evaluator = evaluator['fc']

  return evaluator(score, value);
}