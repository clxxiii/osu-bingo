import type { Options, GameRules } from "./options"


export const getRules = (game: Bingo.Card, squareIdx?: number): GameRules => {
  const options: Options = JSON.parse(game.options);

  const rules: GameRules = {
    claim_condition: options.setup.claim_condition,
    reclaim_condition: options.setup.reclaim_condition,
    multipliers: options.setup.multipliers,
  }

  if (options.setup.stars) {
    rules.stars = options.setup.stars;
  }
  if (options.setup.length) {
    rules.length = options.setup.length;
  }
  if (options.setup.rank) {
    rules.rank = options.setup.rank;
  }

  // TODO: Get current Claim Condition according to events

  if (!squareIdx) return rules

  // TODO: Change rules if square is in a block

  return rules;
}