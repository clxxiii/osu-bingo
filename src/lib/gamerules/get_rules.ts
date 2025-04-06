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

  // TODO: Change rules if square is in a block

  if (!game.start_time) return rules;

  // TODO: Get current Claim Condition according to events
  const seconds_into_game = (Date.now() - new Date(game.start_time).valueOf()) / 1000

  for (const event of options.event) {
    if (event.seconds_after_start < seconds_into_game) {
      if (event.event == 'claimchange') {
        rules.claim_condition = event.detail;
      } else if (event.event == 'reclaimchange') {
        rules.reclaim_condition = event.detail;
      }
    }
  }

  if (!squareIdx) return rules


  return rules;
}

export const getEvents = (game: Bingo.Card) => {
  const options: Options = JSON.parse(game.options);
  return options.event;
}