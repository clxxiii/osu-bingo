/**
 * Processes 'TimeEvents' from the database,
 * scheduled by `polling/gamescheduler.ts`
 */

import q from "$lib/drizzle/queries";
import { startGame } from "./game/start";

export type EventHandler = (event: Bingo.TimeEvent) => Promise<void>

const events: { [key: string]: EventHandler } = {
  'start': async ({ game_id, id }) => {
    await q.setFulfilled(id)
    await startGame(game_id)
  }
}

export default events;