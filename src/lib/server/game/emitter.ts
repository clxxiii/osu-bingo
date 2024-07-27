/**
 * This is essentially a custom EventEmitter implementation with a few features specific for the game.
 */
import { isChatMessage, type EmitterEvent } from "$lib/events"
import { logger } from "$lib/logger"
import ShortUniqueId from "short-unique-id"
const { randomUUID } = new ShortUniqueId({ length: 12, dictionary: 'alpha' })

type Fn = (event: EmitterEvent) => unknown
type Listener = {
  game_id: string,
  channel?: string,
  fn: Fn
}

const listeners = new Map<string, Listener>();

export const listen = (game_id: string, fn: Fn, channel?: string) => {
  const id = randomUUID();
  listeners.set(id, {
    game_id,
    channel: channel ?? 'GLOBAL',
    fn
  })
  logger.info(`[+] Total Listeners: ${listeners.size}`, {
    game_id,
    channel
  })
  return id;
}

export const deafen = (id: string) => {
  const listener = listeners.get(id);
  if (listener) listeners.delete(id);
  logger.info(`[-] Total Listeners: ${listeners.size}`, {
    game_id: listener?.game_id,
    channel: listener?.channel
  })
}

export const sendEvent = (game_id: string, event: EmitterEvent) => {
  logger.info(`New ${event.type} event in ${game_id}`, event);
  for (const listener of listeners.values()) {
    if (game_id != listener.game_id) continue;
    if (isChatMessage(event) && listener.channel?.toUpperCase() != event.data.channel.toUpperCase()) continue;
    listener.fn(event)
  }
}