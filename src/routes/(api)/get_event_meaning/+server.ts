import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { getMeaning } from '$lib/server/event_handler';

export const GET: RequestHandler = async ({ url }) => {
	const action = url.searchParams.get('action');
	if (!action) error(StatusCodes.BAD_REQUEST);

	return new Response(getMeaning(action));
};
