import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { StatusCodes } from "$lib/StatusCodes";
import { joinGame } from "$lib/drizzle/queries/gameuser";


export const GET: RequestHandler = async ({ locals, url }) => {
  if (!locals.user) error(StatusCodes.UNAUTHORIZED);
  const game_id = url.searchParams.get('id')
  const team = url.searchParams.get('team')

  if (!game_id || !team) error(StatusCodes.BAD_REQUEST);
  return json(await joinGame(game_id, locals.user.id, team))
}