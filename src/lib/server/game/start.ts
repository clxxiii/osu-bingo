/**
 * Starts a bingo game!
 */

import q from "$lib/drizzle/queries"

export const startGame = async (game_id: string) => {
  await q.setGameState(game_id, 1);
}