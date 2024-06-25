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

export const addScore = async (score: Osu.LazerScore, user: Bingo.Card.FullUser, square_id: string, important?: boolean): Promise<Bingo.Card.FullScore> => {
  const dbScore = (await db.insert(Score).values({
    score_id: score.id,
    lazer: !score.mods.map(x => x.acronym).includes('CL'),
    date: new Date(score.ended_at ?? Date.now()),
    is_fc: score.is_perfect_combo,
    score: score.total_score,
    grade: score.passed ? score.rank : 'F',
    percentage: score.passed ? 1000 : percentage(score),
    accuracy: score.accuracy,
    pp: score.pp,
    mods: score.mods.map(x => x.acronym).filter(x => x != 'CL').join(''),
    max_combo: score.max_combo,
    square_id,
    important,
    user_id: score.user_id,
    game_user_id: user.id
  }).returning())[0]

  return { ...dbScore, user }
}

const percentage = (score: Osu.LazerScore) => {
  const hits =
    (score.statistics.miss ?? 0) +
    (score.statistics.ok ?? 0) +
    (score.statistics.meh ?? 0) +
    (score.statistics.great ?? 0)

  const total_hits = score.maximum_statistics?.great

  if (!hits || !total_hits) return null;

  return hits / total_hits;
}