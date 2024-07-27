export type EmitterEvent = GameUserEvent | StateChangeEvent | FullUpdateEvent | SquareUpdateEvent | FullChatUpdate | ChatMessage | Init

export type GameUserEvent = {
  type: 'gameUser'
  data: {
    type: 'join' | 'leave' | 'switch'
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
    winner?: string
    card?: Bingo.Card | null
  }
}

export type Init = {
  type: 'init',
  data: {
    card: Bingo.Card
    chats: Bingo.Card.FullChat[]
  }
}

export type FullUpdateEvent = {
  type: 'fullUpdate',
  data: Bingo.Card
}

export type FullChatUpdate = {
  type: 'fullChatUpdate',
  data: Bingo.Card.FullChat[]
}

export type ChatMessage = {
  type: 'chat',
  data: Bingo.Card.FullChat
}

export const isGameUserUpdate = (event: EmitterEvent): event is GameUserEvent => event.type == 'gameUser'
export const isSquareUpdate = (event: EmitterEvent): event is SquareUpdateEvent => event.type == 'square';
export const isStateUpdate = (event: EmitterEvent): event is StateChangeEvent => event.type == 'state';
export const isInit = (event: EmitterEvent): event is Init => event.type == 'init'
export const isFullUpdate = (event: EmitterEvent): event is FullUpdateEvent => event.type == 'fullUpdate'
export const isFullChatUpdate = (event: EmitterEvent): event is ChatMessage => event.type == 'fullChatUpdate';
export const isChatMessage = (event: EmitterEvent): event is ChatMessage => event.type == 'chat';