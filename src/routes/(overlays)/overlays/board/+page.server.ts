import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js'
import { StatusCodes } from '$lib/StatusCodes.js';

export const load: PageServerLoad = ({ url }) => {
  const params = url.searchParams;

  const user_id = parseInt(params.get("user_id") || "");
  const game_id = params.get("game_id");

  const settings = {
    show_rules: params.get("show_rules") ? true : false,
    show_labels: params.get("show_labels") ? true : false,
    scale: parseFloat(params.get("scale") ?? "1") ?? 1.0
  }

  // Validate that we have enough data to generate an overlay page
  if (!isNaN(user_id)) {
    return { user_id, game_id: null, settings }
  } else if (game_id) {
    return { user_id: null, game_id, settings }
  } else {
    redirect(StatusCodes.TEMPORARY_REDIRECT, "/overlays")
  }
}