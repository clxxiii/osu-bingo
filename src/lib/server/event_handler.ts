/**
 * Processes 'TimeEvents' from the database,
 * scheduled by `polling/gamescheduler.ts`
 */

import { getMeaning as getClaimMeaning } from "$lib/bingo-helpers/claimworthy";
import q from "$lib/drizzle/queries";
import { claimchange } from "./game/rulechange";
import { startGame } from "./game/start";

export type EventHandler = {
  display_string: (event: Bingo.TimeEvent) => string,
  evaluate: (event: Bingo.TimeEvent) => Promise<void>
}

const events: { [key: string]: EventHandler } = {
  'start': {
    display_string: () => `Start the game`,
    evaluate: async ({ game_id, id }) => {
      await q.setFulfilled(id)
      await startGame(game_id)
    }
  },
  'claimchange': {
    display_string: (event) => `Change claim condition: ${getClaimMeaning(event.action.split("_").slice(1).join("_"))}`,
    evaluate: async ({ game_id, id, action }) => {
      await q.setFulfilled(id);
      const rule = action.split("_").slice(1).join("_");
      await claimchange(game_id, rule)
    }
  }
}

export const getMeaning = (event: Bingo.TimeEvent) => {
  const action = event.action.split("_")[0];
  const eventHandler = events[action];
  return eventHandler.display_string(event);
}


export default events;