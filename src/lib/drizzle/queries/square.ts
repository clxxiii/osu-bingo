import { eq } from "drizzle-orm"
import { db } from ".."
import { BingoSquare } from "../schema"

export const setClaimer = async (square_id: string, game_user_id: string) => {
  await db
    .update(BingoSquare)
    .set({ claimed_by_id: game_user_id })
    .where(eq(BingoSquare.id, square_id))
}

export const newSquare = async (square: (typeof BingoSquare.$inferInsert)) => {
  return (await db.insert(BingoSquare).values(square).returning())[0]
}