/**
 * The following file is used to keep track of how long games sit dormant.
 */

import { sendToGame } from "$lib/emitter/server";
import { logger } from "$lib/logger";
import q from "$lib/drizzle/queries"

const IDLE_TIME = 30 * 60 * 1000;
const WARNING = 60 * 1000;

const delete_timers: Map<string, NodeJS.Timer> = new Map();
const warning_timers: Map<string, NodeJS.Timer> = new Map();

export const registerGame = (game_id: string) => {
  delete_timers.set(game_id, setTimeout(() => deleteGame(game_id), IDLE_TIME));
  warning_timers.set(game_id, setTimeout(() => warnDelete(game_id), IDLE_TIME - WARNING));
}

export const clearTimer = (game_id: string) => {
  clearTimeout(delete_timers.get(game_id));
  clearTimeout(warning_timers.get(game_id));
}

const warnDelete = (game_id: string) => {
  sendToGame(game_id, {
    type: 'toast',
    data: {
      severity: "WARNING",
      msg: `Warning! Your game will be deleted in ${WARNING / 1000} seconds due to inactivity!`
    }
  })
  logger.info(`Game ${game_id} is about to be deleted`, { game_id, type: 'delete_warning' })
}
const deleteGame = (game_id: string) => {
  sendToGame(game_id, {
    type: 'toast',
    data: {
      severity: "WARNING",
      msg: "This game was deleted due to inactivity"
    }
  })
  sendToGame(game_id, {
    type: 'delete',
    data: {
      game_id
    }
  })
  q.deleteGame(game_id);
}