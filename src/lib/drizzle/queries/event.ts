import { and, eq, lte } from "drizzle-orm"
import { db } from ".."
import { TimeEvent } from "../schema"
import { logger } from "$lib/logger";

export const getUpcomingEvents = async () => {
  const cutoff = new Date(Date.now() + 1000 * 60 * 5); // Find all events scheduled to happen in the next 5 mins
  logger.silly("Started db request", { "function": "getUpcomingEvents", "obj": "query", "dir": "start" })
  const query = await db
    .select()
    .from(TimeEvent)
    .where(
      and(
        eq(TimeEvent.fulfilled, false),
        lte(TimeEvent.time, cutoff),
      )
    )
  logger.silly("Finished db request", { "function": "getUpcomingEvents", "obj": "query", "dir": "end" })
  return query;
}

export const setFulfilled = async (id: string) => {
  logger.silly("Started db request", { "function": "setFulfilled", "obj": "query", "dir": "start" })
  await db
    .update(TimeEvent)
    .set({ fulfilled: true })
    .where(eq(TimeEvent.id, id))
  logger.silly("Finished db request", { "function": "setFulfilled", "obj": "query", "dir": "end" })
}

export const setEvent = async (game_id: string, action: string, time: Date) => {
  logger.silly("Started db request", { "function": "setEvent", "obj": "query", "dir": "start" })
  const query = (await db
    .insert(TimeEvent)
    .values({
      fulfilled: false,
      action,
      game_id,
      time
    }).returning())[0]
  logger.silly("Finished db request", { "function": "setEvent", "obj": "query", "dir": "end" })
  return query;
}