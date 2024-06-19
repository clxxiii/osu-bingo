import { and, eq, lte } from "drizzle-orm"
import { db } from ".."
import { TimeEvent } from "../schema"

export const getUpcomingEvents = async () => {
  const cutoff = new Date(Date.now() + 1000 * 60 * 5); // Find all events scheduled to happen in the next 5 mins
  return await db
    .select()
    .from(TimeEvent)
    .where(
      and(
        eq(TimeEvent.fulfilled, false),
        lte(TimeEvent.time, cutoff),
      )
    )
}

export const setFulfilled = async (id: string) => {
  await db
    .update(TimeEvent)
    .set({ fulfilled: true })
    .where(eq(TimeEvent.id, id))
}