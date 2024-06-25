import { EventEmitter } from "events"

export type ChatEvent = ChatMessage | FullUpdate | ScoreMessage | PlayerMessage

export type FullUpdate = {
  type: 'fullUpdate',
  data: Bingo.Card.FullChat[]
}

export type ChatMessage = {
  type: 'chat',
  data: Bingo.Card.FullChat
}

export type ScoreMessage = {
  type: 'score',
  data: {
    score: Bingo.Card.FullScore,
    map: Bingo.Card.FullMap
    claim: boolean
  }[]
}

export type PlayerMessage = {
  type: 'player',
  data: {
    action: 'join' | 'leave' | 'switch'
    player: Bingo.Card.FullUser
  }
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
