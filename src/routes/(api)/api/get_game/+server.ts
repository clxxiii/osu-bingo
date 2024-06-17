import { getGame } from '$lib/drizzle/queries/game';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) error(StatusCodes.BAD_REQUEST);
  const game = await getGame(id);
  return json(game);
};
