/**
 * Starts a bingo game!
 */

import q from "$lib/drizzle/queries"
import { sendEvent } from "./emitter";
import { addGame } from "./watch";
import boards from "$lib/bingo-helpers/default_boards"
import { logger } from "$lib/logger";

export const startGame = async (game_id: string) => {
  logger.info(`Starting game ${game_id}!`, { type: 'game_start' });

  const game = await q.getGame(game_id);
  if (!game) return;

  const template: Template = JSON.parse(game.template.data);

  // Set initial settings
  const now = Date.now();
  await q.updateGameSettings(game_id, {
    claim_condition: template.setup.claim_condition,
    tiebreaker: template.setup.reclaim_condition,
    start_time: new Date(now)
  })

  // Create board of maps
  const board = (typeof template.setup.board == 'string') ? boards[template.setup.board] : template.setup.board;

  const squareCount = board.squares.length;
  const totalChance = template.maps.map(x => x.chance).reduce((a, b) => a + b);

  // Calculate how many maps in each pool to fetch
  const counts = [];
  for (const mappool of template.maps) {
    const chance = mappool.chance / totalChance;
    counts.push({
      id: mappool.mappool_id,
      maps: Math.floor(squareCount * chance),
      mode: mappool.mode
    })
  }
  if (counts.map(x => x.maps).reduce((a, b) => a + b) < squareCount) {
    counts.sort((a, b) => a.maps - b.maps)
    counts[0].maps += (squareCount - counts.map(x => x.maps).reduce((a, b) => a + b));
  }

  // Fetch maps in all the pools
  const maps = [];
  for (const pool of counts) {
    if (pool.maps == 0) continue;

    const picks = await q.getRandomMaps(pool.id, pool.maps, game.min_sr, game.max_sr, game.min_length, game.max_length, pool.mode);
    maps.push(...picks);
  }

  // Shuffle maps
  maps.sort(() => Math.random() > 0.5 ? -1 : 1);

  // Create squares
  for (const i in board.squares) {
    const square = board.squares[i];
    await q.newSquare({
      game_id,
      map_id: maps[i].id,
      x_pos: square[0],
      y_pos: square[1]
    })
  }


  // Create Events
  for (const event of template.event) {
    const date = new Date(now + (event.seconds_after_start * 1000));
    await q.setEvent(game_id, event.text, date);
  }

  // Update last settings and send game to clients
  await q.setGameState(game.id, 1);
  addGame(game_id);
  sendEvent(game_id, {
    type: 'state',
    data: {
      'state': 1,
      card: await q.getGame(game_id)
    }
  })
}