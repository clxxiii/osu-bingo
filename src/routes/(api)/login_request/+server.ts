import type { RequestHandler } from "./$types";
import q from "$lib/drizzle/queries";
import { redirect } from "@sveltejs/kit";
import { StatusCodes } from "$lib/StatusCodes";
import { sendToUser } from "$lib/emitter/server";

export const GET: RequestHandler = async ({ locals }) => {
  if (locals.user) {
    const token = await q.getToken(locals.user.id, 'osu');
    if (token) {
      sendToUser(locals.user.id, { type: 'login_request', data: false })
    }
  }
  redirect(StatusCodes.TEMPORARY_REDIRECT, "/login_request/close")
}