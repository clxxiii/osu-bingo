import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./[user_id]/$types";
import { StatusCodes } from "$lib/StatusCodes";
import { changeChannel } from "$lib/server/game/emitter";
import q from "$lib/drizzle/queries";


export const GET: RequestHandler = async ({ params, locals }) => {
  const game = await q.getGame(params.id);
  if (!game) error(StatusCodes.NOT_FOUND);

  if (!locals.user) error(StatusCodes.UNAUTHORIZED);
  const gameUser = await q.getFullUser(game.id, locals.user.id)
  if (!gameUser) error(StatusCodes.UNAUTHORIZED);

  const channel = gameUser.team_name;

  if (channel.toUpperCase() != 'GLOBAL' && channel.toUpperCase() != gameUser.team_name.toUpperCase())
    error(StatusCodes.UNAUTHORIZED)

  changeChannel(locals.user.id, channel);
  return new Response(undefined, { status: 204 })
}