/**
 * Takes some update event from the game stream and returns an updated game
 */

import type { EmitterEvent, FullUpdateEvent, GameUserEvent, SquareUpdateEvent, StateChangeEvent } from "$lib/server/game/emitter";

export const updateGame = (game: Bingo.Card, event: EmitterEvent): Bingo.Card => {
  if (isFullUpdate(event)) return event.data;

  if (isStateUpdate(event)) {
    game.state = event.data.state;
    if (event.data.card) {
      game = event.data.card;
    }
    return game;
  }

  if (isSquareUpdate(event)) {
    if (!game.squares) return game;

    for (const score of event.data) {
      const square = game.squares.find(x => x.id == score.score.square_id)
      if (!square) continue;
      const index = game.squares.indexOf(square);

      game.squares[index].scores.push(score.score);
      if (score.claim) {
        game.squares[index].claimed_by_id = score.score.game_user_id
        game.squares[index].claimed_by = score.score.user
      }
    }
  }

  if (isGameUserUpdate(event)) {
    if (event.data.type == 'join') {
      game.users.push(event.data.user);
    }

    if (event.data.type == 'leave') {
      const i = game.users.findIndex(x => x.id == event.data.user.id);
      if (i > -1)
        game.users.splice(i, 1)
    }

    if (event.data.type == 'switch') {
      const i = game.users.findIndex(x => x.id == event.data.user.id);
      if (i > -1)
        game.users.splice(i, 1)
      game.users.push(event.data.user);
    }
  }

  return game
}

const isFullUpdate = (event: EmitterEvent): event is FullUpdateEvent => {
  return event.type == 'fullUpdate';
}

const isGameUserUpdate = (event: EmitterEvent): event is GameUserEvent => {
  return event.type == 'gameUser';
}

const isSquareUpdate = (event: EmitterEvent): event is SquareUpdateEvent => {
  return event.type == 'square';
}

const isStateUpdate = (event: EmitterEvent): event is StateChangeEvent => {
  return event.type == 'state';
}