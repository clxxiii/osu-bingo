/**
 * Sets up the polling service for fetching user scores.
 */
import q from '$lib/drizzle/queries';
import { logger } from '$lib/logger';
import { updateScores } from './update_scores';

const POLLING_INTERVAL_MS = 10 * 1000;

const watchedGames = new Map<string, Timer>();

export const setup = async () => {
	// Clear current timers
	for (const timer of watchedGames.keys()) {
		removeGame(timer);
	}

	const games = await q.getCurrentGames();

	for (const { id } of games) {
		if (watchedGames.has(id)) continue;
		addGame(id);

		// Space out games so that all requests don't happen at the same time
		await new Promise((resolve) => setTimeout(resolve, 5000 + Math.random() * 9000));
	}
};

export const addGame = (id: string) => {
	logger.info('Started watching game ' + id + ' for new scores', { type: 'start_watch' });
	watchedGames.set(
		id,
		setInterval(() => {
			updateScores(id);
		}, POLLING_INTERVAL_MS)
	);
};

export const removeGame = (id: string) => {
	logger.info('Stopped watching game ' + id, { type: 'stop_watch' });
	clearInterval(watchedGames.get(id));
	watchedGames.delete(id);
};
