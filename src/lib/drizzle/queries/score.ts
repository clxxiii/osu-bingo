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

export const addScore = async (score: Osu.LazerScore, game_user: Bingo.GameUser, square_id: string, important?: boolean) => {
  return (await db.insert(Score).values({
    lazer: score.legacy_total_score != 0,
    date: new Date(score.ended_at ?? Date.now()),
    is_fc: score.is_perfect_combo,
    score: score.total_score,
    grade: score.rank,
    accuracy: score.accuracy,
    pp: score.pp,
    mods: score.mods.map(x => x.acronym).join(''),
    max_combo: score.max_combo,
    square_id,
    important,
    user_id: score.user_id,
    game_user_id: game_user.id
  }).returning())[0]
}