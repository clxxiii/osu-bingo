/**
 * Processes 'TimeEvents' from the database,
 * scheduled by `polling/gamescheduler.ts`
 */

import q from "$lib/drizzle/queries";
import { claimchange } from "./game/rulechange";
import { startGame } from "./game/start";

export type EventHandler = (event: Bingo.TimeEvent) => Promise<void>

const events: { [key: string]: EventHandler } = {
  'start': async ({ game_id, id }) => {
    await q.setFulfilled(id)
    await startGame(game_id)
  },
  'claimchange': async ({ game_id, id, action }) => {
    await q.setFulfilled(id);
    const rule = action.split("_").slice(1).join("_");
    await claimchange(game_id, rule)
  }
}

export default events;