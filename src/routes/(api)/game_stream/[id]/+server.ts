/**
 * Connects to a game's ID and streams any updates that come in.
 * 
 * HINT: Connect from the client using an EventSource()
 * https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 */
import type { RequestHandler } from "./$types"
import q from "$lib/drizzle/queries";
import { deafen, listen } from "$lib/server/game/emitter";

export const GET: RequestHandler = ({ params }) => {
  let eventHandler: (game: unknown) => void;
  const stream = new ReadableStream({
    start: async (controller) => {
      // Send initial game state
      const game = await q.getGame(params.id);
      controller.enqueue(`data: ${JSON.stringify({
        type: 'fullUpdate',
        data: game
      })}\n\n`)

      eventHandler = (game) => {
        controller.enqueue(`data: ${JSON.stringify(game)}\n\n`)
      }
      listen(params.id, eventHandler)
    },
    cancel: () => {
      if (eventHandler) deafen(params.id, eventHandler);
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  })
}