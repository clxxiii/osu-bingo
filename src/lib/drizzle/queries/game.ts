import { and, eq, or } from 'drizzle-orm';
import { db } from '..';
import { BingoGame, BingoSquare, Chat, GameUser, Map, MapStats, Score, TimeEvent, User } from '../schema';
import { getBeatmaps } from '$lib/server/osu';
import type { Osu } from '$lib/osu';
import { addMap } from './map';

export const newGame = async () => {
  const randomLetter = () => {
    const A = 65;
    const random = Math.floor(Math.random() * 26);
    return String.fromCharCode(A + random);
  };
  let link_id = '';
  // Check for duplicate link IDs
  while (true) {
    link_id = `${randomLetter()}${randomLetter()}${randomLetter()}${randomLetter()}`;
    const duplicate = await db
      .select()
      .from(BingoGame)
      .where(and(eq(BingoGame.link_id, link_id), eq(BingoGame.state, 0)));
    if (duplicate.length == 0) break;
  }

  return (
    await db
      .insert(BingoGame)
      .values({
        link_id
      })
      .returning()
  )[0];
};

export const fillSquares = async (
  game_id: string,
  min_sr: number,
  max_sr: number,
  access_token: string
) => {
  // Currently, the app just gets the 25 most recent beatmaps.
  // In the future, some better solution should be used for this.
  const sets = await getBeatmaps(min_sr, max_sr, access_token);

  const beatmaps: { map: Osu.BeatmapExtended, set: Osu.Beatmapset }[] = [];
  outer_loop: while (beatmaps.length < 25) {
    for (const set of sets) {
      if (!set.beatmaps) continue;

      for (const map of set?.beatmaps) {
        if (map.difficulty_rating < min_sr || map.difficulty_rating > max_sr) continue;

        const newSet = structuredClone(set);
        delete newSet.beatmaps;

        beatmaps.push({ map: map as Osu.BeatmapExtended, set: newSet });
        if (beatmaps.length >= 25) break outer_loop;
      }
    }
  }

  for (const map of beatmaps) {
    await addMap(map.map, map.set)
  }

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const beatmap = beatmaps[y * 5 + x];

      await db.insert(BingoSquare).values({
        game_id,
        map_id: beatmap.map.id,
        x_pos: x,
        y_pos: y
      });
    }
  }
};

export const getGame = async (game_id: string) => {
  const game = (await db.select().from(BingoGame).where(eq(BingoGame.id, game_id)))[0];


  //@ts-ignore
  const users: Bingo.Card.FullUser[] = await db
    //@ts-ignore
    .select({ ...GameUser, ...User })
    .from(GameUser)
    .where(eq(GameUser.game_id, game_id))
    .innerJoin(User, eq(GameUser.user_id, User.id));

  const events = await db.select().from(TimeEvent).where(eq(TimeEvent.game_id, game_id));
  const chats = await db.select().from(Chat).where(eq(Chat.game_id, game_id));

  if (game.state == 0) return { ...game, users, events, chats, squares: null }

  const squares: Bingo.Card.FullSquare[] = [];
  const dbSquares = await db
    .select()
    .from(BingoSquare)
    .where(eq(BingoSquare.game_id, game_id))
  for (const square of dbSquares) {
    const map = (await db
      .select()
      .from(Map)
      .innerJoin(
        MapStats,
        eq(MapStats.map_id, Map.id))
      .where(and(
        eq(Map.id, square.map_id),
        eq(MapStats.mod_string, square.mod_string ?? "")
      ))
    )[0];
    const scores = await db.select().from(Score).where(eq(Score.square_id, square.id));
    squares.push({
      ...square,
      data: {
        ...map.Map,
        stats: map.MapStats
      },
      scores
    })
  }

  return { ...game, users, events, squares, chats };
};

export const gameLinkToId = async (link: string) => {
  const query = (
    await db
      .select({ game_id: BingoGame.id })
      .from(BingoGame)
      .where(and(eq(BingoGame.link_id, link), or(eq(BingoGame.state, 0), eq(BingoGame.state, 1))))
  )[0];
  if (query == undefined) return null;

  return query.game_id;
};

export const getGameFromLinkId = async (link: string) => {
  const game_id = await gameLinkToId(link);
  if (!game_id) return null;
  return await getGame(game_id);
};
