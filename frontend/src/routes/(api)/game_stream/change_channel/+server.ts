import { switchChannel } from '$lib/emitter/server';
import { StatusCodes } from '$lib/StatusCodes';
import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ url }) => {
	const id = url.searchParams.get('id');
	const channel = url.searchParams.get('channel');
	if (!id || !channel) error(StatusCodes.BAD_REQUEST);

	const listener = switchChannel(id, channel);
	if (!listener) error(StatusCodes.BAD_REQUEST);
	return json(listener);
};
