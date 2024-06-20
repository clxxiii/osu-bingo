import { and, eq } from "drizzle-orm"
import { db } from ".."
import { Score } from "../schema"
import type { Osu } from "$lib/osu"

export const getScores = async (user_id: number, square_id: string) => {
  return (await db.select()
    .from(Score)
    .where(and(
      eq(Score.user_id, user_id),
      eq(Score.square_id, square_id)
    )))
}

export const addScore = async (score: Osu.Score, game_id: string, square_id: string, important?: boolean) => {
  return (await db.insert(Score).values({
    date: new Date(score.created_at ?? Date.now()),
    is_fc: score.perfect,
    score: score.score,
    grade: score.rank ?? "F",
    accuracy: score.accuracy,
    pp: score.pp,
    mods: score.mods.join(''),
    max_combo: score.max_combo,
    square_id,
    important,
    game_id,
    user_id: score.user_id
  }).returning())[0]
}