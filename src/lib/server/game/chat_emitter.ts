import { EventEmitter } from "events"

export type ChatEvent = UserMessage | FullUpdate

export type FullUpdate = {
  type: 'fullUpdate',
  data: Bingo.Card.FullChat[]
}

export type UserMessage = {
  type: 'user',
  data: Bingo.Card.FullChat
}

const emitter = new EventEmitter()

export const sendEvent = (game_id: string, channel: string, event: ChatEvent) => {
  emitter.emit(`${game_id}_${channel.toUpperCase()}`, event)
}

export const listen = (game_id: string, channel: string, fn: (event: ChatEvent) => unknown) => {
  emitter.on(`${game_id}_${channel.toUpperCase()}`, fn)
}

export const deafen = (game_id: string, channel: string, fn: (event: ChatEvent) => unknown) => {
  emitter.off(`${game_id}_${channel.toUpperCase()}`, fn)
}