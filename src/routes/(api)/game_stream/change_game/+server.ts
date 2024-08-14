import q from "$lib/drizzle/queries"
import {sendToListener, switchGame} from "$lib/emitter/server";
import {StatusCodes} from "$lib/StatusCodes";
import {error, json} from "@sveltejs/kit";

import type {RequestHandler} from "./$types";

export const POST: RequestHandler = async ({url}) => {
  const id = url.searchParams.get("id");
  const game_id = url.searchParams.get("game_id");
  if (!id || !game_id)
    error(StatusCodes.BAD_REQUEST);

  const listener = switchGame(id, game_id)
  if (!listener) error(StatusCodes.BAD_REQUEST);

  const game = await q.getGame(game_id);
  if (game) {
    sendToListener(id, {type : "fullUpdate", data : game})
  }
  return json(listener);
}
