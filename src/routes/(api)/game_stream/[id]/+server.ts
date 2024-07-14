/**
 * Connects to a game's ID and streams any updates that come in.
 * 
 * HINT: Connect from the client using an EventSource()
 * https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 */
import type { RequestHandler } from "./$types"
import q from "$lib/drizzle/queries";
import { deafen, listen } from "$lib/server/game/emitter";
import { produce } from "sveltekit-sse";

export const POST: RequestHandler = ({ params }) => {
  let eventHandler: (game: unknown) => void;

  return produce(async ({ emit }) => {
    // Send initial game state
    const game = await q.getGame(params.id);
    emit('message', JSON.stringify({ type: 'fullUpdate', data: game }));

    eventHandler = (game) => {
      emit('message', JSON.stringify(game))
    }
    listen(params.id, eventHandler)
  }, {
    stop: () => {
      deafen(params.id, eventHandler)
    }
  })
}