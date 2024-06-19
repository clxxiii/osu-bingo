/**
 * Connects to a game's ID and streams any updates that come in.
 * 
 * HINT: Connect from the client using an EventSource()
 * https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 */
import type { RequestHandler } from "./$types"
import q from "$lib/drizzle/queries"
import { emitter } from "$lib/drizzle";

export const GET: RequestHandler = ({ params }) => {
  let eventHandler: (game: unknown) => void;
  const stream = new ReadableStream({
    start: async (controller) => {
      // Send initial game state
      const game = await q.getGame(params.id);
      controller.enqueue(`data: ${JSON.stringify(game)}\n\n`)

      eventHandler = (game) => {
        controller.enqueue(`data: ${JSON.stringify(game)}\n\n`)
      }
      emitter.on(params.id, eventHandler)
    },
    cancel: () => {
      if (eventHandler) emitter.off(params.id, eventHandler);
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  })
}