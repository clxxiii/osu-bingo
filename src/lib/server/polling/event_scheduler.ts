import q from "$lib/drizzle/queries";
import handlers from "../event_handler"

const POLLING_INTERVAL_MS = 30 * 1000;

const scheduledEvents: Map<string, boolean> = new Map();
let timeout: Timer
export const setup = () => {
  if (!timeout) interval() // Run immediately
  clearTimeout(timeout)
  timeout = setTimeout(async () => {
    await interval();
    setup();
  }, POLLING_INTERVAL_MS)
}

export const interval = async () => {
  const events = await q.getUpcomingEvents();
  for (const event of events) {
    if (scheduledEvents.has(event.id)) continue;

    const eventHandler = handlers[event.action];
    if (!eventHandler) {
      console.log(`Invalid event action "${event.action}".`);
      await q.setFulfilled(event.id);
      continue;
    }

    const relativeTime = event.time.valueOf() - Date.now();

    setTimeout(() => {
      scheduledEvents.delete(event.id);
      eventHandler(event)
    }, relativeTime < 0 ? 0 : relativeTime)
    scheduledEvents.set(event.id, true)
    console.log(`Scheduled ${event.action} event for game ${event.game_id} (in ${relativeTime / 1000}s)`)
  }

}