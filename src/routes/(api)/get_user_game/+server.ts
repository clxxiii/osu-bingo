import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types"
import { StatusCodes } from "$lib/StatusCodes";
import q from "$lib/drizzle/queries"

export const GET: RequestHandler = async ({ url }) => {
  const user_id = parseInt(url.searchParams.get("user_id") ?? "");
  if (isNaN(user_id)) error(StatusCodes.BAD_REQUEST);
  const gameUser = await q.isInGame(user_id)
  if (!gameUser) {
    return json({})
  }
  return json(gameUser);
}