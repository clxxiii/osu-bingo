/**
 * All of the stores for keeping UI up to date.
 */
import { writable } from "svelte/store";
import { type ChatMessage, type EmitterEvent, isInit, isFullUpdate, isStateUpdate, isSquareUpdate, isGameUserUpdate, isChatMessage, type GameUserEvent } from "$lib/events";
import { source } from "sveltekit-sse";

let close: (() => void) | null = null;

export const connected = writable<boolean>(false);
export const game = writable<Bingo.Card>()
export const chats = writable<(ChatMessage | GameUserEvent)[]>([]);

export const listen = async (game_id: string, user_id?: number) => {
  if (close) close()
  close = null;

  const params = new URLSearchParams()
  if (user_id) {
    params.set('user_id', `${user_id}`)
  }
  const stream = source(`/game_stream/${game_id}?${params.toString()}`, {
    close: ({ connect }) => {
      connected.set(false)
      setTimeout(() => {
        connect();
        connected.set(true);
      }, 2000)
    }
  })
  stream.select('message').subscribe((msg) => {
    let event: EmitterEvent | null = null;
    try {
      event = JSON.parse(msg);
    } catch {
      return;
    }
    if (!event) return;
    console.log(event);
    updateGame(event);
    // Update channel if needed
    if (isStateUpdate(event)) {
      fetch(`/game_stream/${game_id}/change_channel`)
    }
  });
  close = () => stream.close()
  connected.set(true);
}

export const updateGame = (event: EmitterEvent) => {
  game.update((card) => {
    if (isInit(event)) return event.data.card;

    if (isFullUpdate(event)) return event.data;

    if (isStateUpdate(event)) {
      card.state = event.data.state;
      if (event.data.winner) card.winning_team = event.data.winner ?? null
      if (event.data.card) {
        card = event.data.card;
      }
      return card;
    }

    if (isSquareUpdate(event)) {
      if (!card.squares) return card;

      for (const score of event.data) {
        const square = card.squares.find(x => x.id == score.score.square_id)
        if (!square) continue;
        const index = card.squares.indexOf(square);

        card.squares[index].scores.push(score.score);
        if (score.claim) {
          card.squares[index].claimed_by_id = score.score.game_user_id
          card.squares[index].claimed_by = score.score.user
        }
      }
    }

    if (isGameUserUpdate(event)) {
      if (event.data.type == 'join') {
        card.users.push(event.data.user);
      }

      if (event.data.type == 'leave') {
        const i = card.users.findIndex(x => x.id == event.data.user.id);
        if (i > -1)
          card.users.splice(i, 1)
      }

      if (event.data.type == 'switch') {
        const i = card.users.findIndex(x => x.id == event.data.user.id);
        if (i > -1)
          card.users.splice(i, 1)
        card.users.push(event.data.user);
      }
    }

    return card
  })
  chats.update(chats => {
    if (isInit(event)) return event.data.chats.map(data => ({ type: 'chat', data }))
    if (isChatMessage(event)) chats.push(event)
    if (isGameUserUpdate(event)) chats.push(event)

    return chats;
  })

}
