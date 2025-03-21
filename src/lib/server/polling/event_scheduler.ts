import q from '$lib/drizzle/queries';
import { logger } from '$lib/logger';
import handlers from '../event_handler';

const POLLING_INTERVAL_MS = 30 * 1000;

const scheduledEvents: Map<string, boolean> = new Map();
let timeout: Timer;
export const setup = () => {
	if (!timeout) interval(); // Run immediately
	clearTimeout(timeout);
	timeout = setTimeout(async () => {
		await interval();
		setup();
	}, POLLING_INTERVAL_MS);
};

export const interval = async () => {
	logger.debug("Looking for new events", { type: "event_poll" })

	const events = await q.getUpcomingEvents();
	for (const event of events) {
		if (scheduledEvents.has(event.id)) continue;

		const action = event.action.split('_')[0];
		const eventHandler = handlers[action];
		if (!eventHandler) {
			logger.warn(`Invalid event action "${action}".`, { type: 'invalid_event' });
			await q.setFulfilled(event.id);
			continue;
		}

		const relativeTime = event.time.valueOf() - Date.now();

		setTimeout(
			() => {
				scheduledEvents.delete(event.id);
				eventHandler.evaluate(event);
			},
			relativeTime < 0 ? 0 : relativeTime
		);
		scheduledEvents.set(event.id, true);
		logger.info(
			`Scheduled ${event.action} event for game ${event.game_id} (in ${relativeTime / 1000}s)`,
			{ type: 'scheduled_event' }
		);
	}
};
