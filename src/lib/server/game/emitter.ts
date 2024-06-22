import { EventEmitter } from "events"

export type EmitterEvent = GameUserEvent | StateChangeEvent | FullUpdateEvent | SquareUpdateEvent

export type GameUserEvent = {
  type: 'gameUser'
  data: {
    type: 'join' | 'leave'
    user: Bingo.Card.FullUser
  }
}

export type SquareUpdateEvent = {
  type: 'square',
  data: {
    score: Bingo.Card.FullScore,
    claim: boolean
  }[],
}

export type StateChangeEvent = {
  type: 'state'
  data: {
    state: number
  }
}

export type FullUpdateEvent = {
  type: 'fullUpdate',
  data: Bingo.Card
}

const emitter = new EventEmitter()

export const sendEvent = (game_id: string, event: EmitterEvent) => {
  emitter.emit(game_id, event)
}

export const listen = (game_id: string, fn: (event: EmitterEvent) => unknown) => {
  emitter.on(game_id, fn);
}

export const deafen = (game_id: string, fn: (event: EmitterEvent) => unknown) => {
  emitter.off(game_id, fn);
}