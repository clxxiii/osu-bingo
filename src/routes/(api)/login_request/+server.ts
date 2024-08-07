import type { RequestHandler } from "./$types";
import q from "$lib/drizzle/queries";
import { requestLogin } from "$lib/server/game/emitter";
import { redirect } from "@sveltejs/kit";
import { StatusCodes } from "$lib/StatusCodes";

export const GET: RequestHandler = async ({ locals }) => {
  if (locals.user) {
    const token = await q.getToken(locals.user.id, 'osu');
    if (token) {
      requestLogin(locals.user.id, false);
    }
  }
  redirect(StatusCodes.TEMPORARY_REDIRECT, "/login_request/close")
}