/**
 * Finds tokens that will expire soon and refreshes them
 */

import q from '$lib/drizzle/queries';
import { updateUser } from '$lib/drizzle/queries/user';

const POLLING_INTERVAL_MS = 60 * 1000;

let timeout: Timer;
export const setup = () => {
	clearTimeout(timeout);
	timeout = setTimeout(async () => {
		await interval();
		setup();
	}, POLLING_INTERVAL_MS);
};

const interval = async () => {
	const lingeringTokens = await q.getLingeringTokens();

	for (const old of lingeringTokens) {
		// Rate limit (make 1 request per second)
		await new Promise((resolve) => setTimeout(resolve, 1000));
		await updateUser(old);
	}
};
