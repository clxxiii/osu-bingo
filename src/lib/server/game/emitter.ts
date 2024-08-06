/**
 * This is essentially a custom EventEmitter implementation with a few features specific for the game.
 */
import { isChatMessage, type EmitterEvent } from "$lib/events"
import { logger } from "$lib/logger"
import ShortUniqueId from "short-unique-id"
import q from "$lib/drizzle/queries"
const { randomUUID } = new ShortUniqueId({ length: 12, dictionary: 'alpha' })

type Fn = (event: EmitterEvent) => unknown
type Listener = {
  game_id: string,
  user_id?: number
  channel?: string,
  fn: Fn
}

const listeners = new Map<string, Listener>();

export const listen = async (game_id: string, fn: Fn, user_id?: number) => {
  let channel = 'GLOBAL'
  if (user_id) {
    const game_user = await q.getFullUser(game_id, user_id)
    if (game_user) {
      channel = game_user.team_name
    }
  }

  const id = randomUUID();
  listeners.set(id, {
    game_id,
    user_id,
    channel: channel ?? 'GLOBAL',
    fn
  })
  logger.info(`[+] Total Listeners: ${listeners.size}`, {
    game_id,
    channel,
    type: 'listener_added'
  })
  return id;
}

export const deafen = (id: string) => {
  const listener = listeners.get(id);
  if (listener) listeners.delete(id);
  logger.info(`[-] Total Listeners: ${listeners.size}`, {
    game_id: listener?.game_id,
    channel: listener?.channel,
    type: 'listener_removed'
  })
}

export const changeChannel = (user_id: number, channel: string) => {
  for (const id of listeners.keys()) {
    const listener = listeners.get(id);
    if (!listener) continue;

    if (listener.user_id == user_id) {
      listener.channel = channel;
      logger.info(`Updated listener channel ${id}`, { ...listener, type: 'listener_channel_switch' });
    }
    listeners.set(id, listener);
  }
}

export const sendEvent = (game_id: string, event: EmitterEvent) => {
  logger.info(`New ${event.type} event in ${game_id}`, { ...event, type: 'sent_event' });
  for (const listener of listeners.values()) {
    if (game_id != listener.game_id) continue;
    if (isChatMessage(event) && listener.channel?.toUpperCase() != event.data.channel.toUpperCase()) continue;
    listener.fn(event)
  }
}