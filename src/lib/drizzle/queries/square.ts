import { eq } from "drizzle-orm"
import { db } from ".."
import { BingoSquare } from "../schema"

export const setClaimer = async (square_id: string, team: string) => {
  await db
    .update(BingoSquare)
    .set({ claimed_by: team })
    .where(eq(BingoSquare.id, square_id))
}