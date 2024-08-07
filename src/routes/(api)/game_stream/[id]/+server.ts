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
import { StatusCodes } from "$lib/StatusCodes";
import { error } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ params, locals }) => {
  let handlerId: string;

  // Send initial game state
  const game = await q.getGame(params.id);
  if (!game) error(StatusCodes.NOT_FOUND);

  let channel = 'GLOBAL';
  if (locals.user) {
    if (!locals.user) error(StatusCodes.UNAUTHORIZED);
    const gameUser = await q.getFullUser(game.id, locals.user.id)
    if (!gameUser) error(StatusCodes.UNAUTHORIZED);

    channel = gameUser.team_name.toUpperCase();
  }

  return produce(async ({ emit }) => {
    const chats = await q.getChatChannel(game.id, channel ?? 'global');

    handlerId = await listen(params.id,
      (event) => {
        emit('message', JSON.stringify(event))
      },
      locals.user?.id
    )

    emit('message', JSON.stringify({
      type: 'init', data: {
        id: handlerId,
        card: game,
        chats,
      }
    }));

    if (locals.user) {
      const token = await q.getToken(locals.user.id, 'osu');
      if (!token) {
        emit('message', JSON.stringify({ type: 'login_request', data: true }));
      }
    }
  }, {
    stop: () => {
      deafen(handlerId)
    }
  })
}