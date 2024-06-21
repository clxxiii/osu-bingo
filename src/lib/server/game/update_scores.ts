/**
 * The main logic of the game; fetches new scores,
 * decides what to do when a new score is added.
 */
import { emitter } from "$lib/drizzle";
import q from "$lib/drizzle/queries"
import type { Osu } from "$lib/osu";
import { getRecentScores } from "../osu";
import { scoreBeatsBest } from "$lib/bingo-helpers/best_score";
import { checkWin } from "$lib/bingo-helpers/check_win";
import { isClaimworthy } from "$lib/bingo-helpers/claimworthy";
import { removeGame } from "./watch";

const updating = new Set<string>();

export const updateScores = async (game_id: string) => {
  if (updating.has(game_id)) return;

  updating.add(game_id);
  const game = await q.getGame(game_id);
  if (game.state != 1 || !game.squares) return;


  // Get each user's recent scores
  const scores: Osu.LazerScore[] = [];
  for (const user of game.users) {
    // a wee bit of ratelimiting
    await new Promise(resolve => setTimeout(resolve, 100))
    const token = await q.getToken(user.id);

    // If there's no token to use, we can't get scores
    if (!token) {
      console.log(`Failed to fetch scores for ${user.username}`)
      continue;
    }

    const scoreList = await getRecentScores(user.id, token.access_token);

    if (!scoreList) {
      console.log(`Failed to fetch scores for ${user.username}`)
      continue;
    }

    for (const score of scoreList) {
      scores.push(score)
    }
  }

  // Scores are processsed in order of creation to
  // resolve the following edge case:

  // Blue is one square away from winning, Blue sets
  // a score that claims the square, then Red sets
  // one that beats that square within the same
  // polling period.
  scores.sort((a, b) => {
    return new Date(a.ended_at ?? Date.now()).valueOf() -
      new Date(b.ended_at ?? Date.now()).valueOf()
  });

  for (const score of scores) {
    await processScore(score, game);
  }

  emitter.emit(game.id, await q.getGame(game.id));
  updating.delete(game_id);
}

const processScore = async (score: Osu.LazerScore, game: Bingo.Card) => {
  if (!game.squares) return;

  // This score is not related to the board
  const square = game.squares.find(x => x.map_id == score?.beatmap?.id)
  if (!square) return;

  const scores = await q.getScores(score.user_id, square.id)

  // Score has already been processed
  const scoreMap = scores.map(x => x.score);
  if (scoreMap.includes(score.total_score)) return
  console.log(`Processing Score: ${score.user.username} on ${score.beatmapset?.title}: (${score.total_score})`)


  // Add score to database
  const claimworthy = isClaimworthy(score, game.claim_condition)
  const user: Bingo.Card.FullUser = game.users.find(x => x.id == score.user_id)

  const newScore = await q.addScore(score, user, square.id, claimworthy)

  if (game.state == 1 && claimworthy && scoreBeatsBest(square, newScore, 'score')) {
    await q.setClaimer(square.id, user.game_user_id)


    const win = checkWin(await q.getGame(game.id));
    if (win) {
      q.setGameState(game.id, 2);
      removeGame(game.id);
    }
  }
}