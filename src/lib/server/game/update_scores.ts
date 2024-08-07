/**
 * The main logic of the game; fetches new scores,
 * decides what to do when a new score is added.
 */
import q from "$lib/drizzle/queries"
import type { Osu } from "$lib/osu";
import { getRecentScores } from "../osu";
import { scoreBeatsBest } from "$lib/bingo-helpers/best_score";
import { checkWin } from "$lib/bingo-helpers/check_win";
import { isClaimworthy } from "$lib/bingo-helpers/claimworthy";
import { removeGame } from "./watch";
import { requestLogin, sendEvent } from "./emitter";
import { logger } from "$lib/logger";

const updating = new Set<string>();

export const updateScores = async (game_id: string) => {
  if (updating.has(game_id)) return;
  logger.debug(`Checking for new user scores for game ${game_id}`, { type: 'checking_scores' })

  updating.add(game_id);
  const game = await q.getGame(game_id);
  if (!game) {
    logger.warn(`Cannot find game ${game_id}`, { type: 'missing_game' })
    removeGame(game_id);
    return;
  };
  if (game.state != 1 || !game.squares) return;


  // Get each user's recent scores
  const scores: Osu.LazerScore[] = [];
  for (const gameuser of game.users) {
    // a wee bit of ratelimiting
    await new Promise(resolve => setTimeout(resolve, 100))
    let token = await q.getToken(gameuser.user_id);

    // If there's no token to use, we can't get scores
    if (!token) {
      continue;
    }

    let scoreList = await getRecentScores(gameuser.user_id, token.access_token);

    if (!scoreList) {
      logger.info(`Invalid token for ${gameuser.user.username}, trying a refresh`, { type: 'invalid_token_fetch' })
      const update = await q.updateUser(token);
      if (!update) {
        logger.warn(`Failed to fetch scores for ${gameuser.user.username}`, { type: 'fetch_user_scores_failed' })
        if (token.user_id) requestLogin(token.user_id);
        continue;
      }
      token = update;
      scoreList = await getRecentScores(gameuser.user_id, token.access_token);
      if (!scoreList) {
        continue;
      }
    }

    for (const score of scoreList) {
      if (game.start_time && new Date(score.ended_at).valueOf() <= game.start_time.valueOf()) {
        continue;
      }
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


  const updates: { score: Bingo.Card.FullScore, square: Bingo.Card.FullSquare, claim: boolean }[] = []
  let win = false;
  let winner = '';
  for (const score of scores) {
    const event = await processScore(score, game);
    if (event) {
      updates.push(event)
      if (event.win) {
        win = true;
        winner = event.winner
      }
    }
  }
  if (updates.length > 0) {
    sendEvent(game_id, {
      type: 'square',
      data: updates
    })
  }
  if (win) {
    sendEvent(game_id, {
      type: 'state',
      data: {
        state: 2,
        winner
      }
    })
  }

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
  logger.info(`Processing Score: ${score.user.username} on ${score.beatmapset?.title}: (${score.total_score})`, { ...score, type: 'process_score' })


  // Add score to database
  const claimworthy = isClaimworthy(score, game.claim_condition)
  const user: Bingo.Card.FullUser | undefined = game.users.find(x => x.user_id == score.user_id)
  if (!user) return
  const newScore = await q.addScore(score, user, square.id, claimworthy)

  // For sending to the client
  const update = {
    score: newScore,
    square,
    claim: false,
    win: false,
    winner: ''
  }
  if (game.state == 1 && claimworthy && scoreBeatsBest(square, newScore, 'score')) {
    update.claim = true;
    await q.setClaimer(square.id, user.id)

    const winCheck = await q.getGame(game.id); // Refetch the game to get updated properties
    if (!winCheck) return update;
    const win = checkWin(winCheck);
    if (win) {
      q.setGameState(game.id, 2, win.winner.toUpperCase());
      removeGame(game.id);
      update.win = true;
      update.winner = win.winner.toUpperCase();
    }
  }
  return update;
}