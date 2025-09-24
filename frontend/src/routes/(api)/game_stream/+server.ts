/**
 * Connects to a game's ID and streams any updates that come in.
 *
 * HINT: Connect from the client using an EventSource()
 * https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 */
import q from '$lib/drizzle/queries';
import type { Listener } from '$lib/emitter';
import { addListener, removeListener } from '$lib/emitter/server';
import { produce } from 'sveltekit-sse';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, url }) => {
	const game_id = url.searchParams.get('game_id');
	let listener: Listener;

	return produce(
		async ({ emit }) => {
			listener = addListener(
				(event) => {
					emit('message', JSON.stringify(event));
				},
				game_id ?? undefined,
				locals.user?.id
			);

			emit(
				'message',
				JSON.stringify({
					type: 'init',
					data: {
						id: listener.id
					}
				})
			);

			if (locals.user) {
				const token = await q.getToken(locals.user.id, 'osu');
				if (!token) {
					emit('message', JSON.stringify({ type: 'login_request', data: true }));
				}
			}
		},
		{
			stop: () => {
				removeListener(listener.id);
			}
		}
	);
};
