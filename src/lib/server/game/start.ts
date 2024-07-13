/**
 * Starts a bingo game!
 */

import q from "$lib/drizzle/queries"
import { sendEvent } from "./emitter";
import { addGame } from "./watch";

export const startGame = async (game_id: string) => {
  await q.fillSquares(game_id, 'osu')
  await q.setGameState(game_id, 1);
  addGame(game_id);
  sendEvent(game_id, {
    type: 'state',
    data: {
      'state': 1,
      card: await q.getGame(game_id)
    }
  })
}