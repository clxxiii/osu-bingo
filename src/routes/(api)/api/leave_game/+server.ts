import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { StatusCodes } from "$lib/StatusCodes";
import { leaveGame } from "$lib/drizzle/queries/gameuser";


export const GET: RequestHandler = async ({ locals, url }) => {
  if (!locals.user) error(StatusCodes.UNAUTHORIZED);
  const game_id = url.searchParams.get('id')

  if (!game_id) error(StatusCodes.BAD_REQUEST);
  const gameUser = await leaveGame(game_id, locals.user.id);
  return json(gameUser);
}