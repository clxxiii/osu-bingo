/**
 * Connects to a game's ID and streams any updates that come in.
 * 
 * HINT: Connect from the client using an EventSource()
 * https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 */
import type { RequestHandler } from "./$types"
import q from "$lib/drizzle/queries";
import { deafen, listen } from "$lib/server/game/chat_emitter";
import { error } from "@sveltejs/kit";
import { StatusCodes } from "$lib/StatusCodes";
import { produce } from "sveltekit-sse";

export const POST: RequestHandler = async ({ params, locals }) => {
  const channel = params.channel;
  const game_id = params.game_id;

  if (!locals.user) error(StatusCodes.UNAUTHORIZED);
  const gameUser = await q.getFullUser(game_id, locals.user.id)
  if (!gameUser) error(StatusCodes.UNAUTHORIZED);

  if (channel.toUpperCase() != 'GLOBAL' && channel.toUpperCase() != gameUser.team_name.toUpperCase())
    error(StatusCodes.UNAUTHORIZED)

  let eventHandler: (game: unknown) => void;
  return produce(async ({ emit }) => {
    // Send current chats
    const game = await q.getChatChannel(game_id, channel);
    emit('message', JSON.stringify({
      type: 'fullUpdate',
      data: game
    }))

    eventHandler = (game) => {
      emit('message', JSON.stringify(game))
    }
    listen(game_id, channel, eventHandler)
  }, {
    stop: () => {
      deafen(game_id, channel, eventHandler);
    }
  })
}