/**
 * Starts a bingo game!
 */

import q from "$lib/drizzle/queries"
import { addGame } from "./watch";

export const startGame = async (game_id: string) => {
  await q.setGameState(game_id, 1);
  addGame(game_id);
}