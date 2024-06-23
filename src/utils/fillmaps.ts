import { OauthToken, User, Map, MapStats } from "$lib/drizzle/schema"
import { and, eq } from "drizzle-orm"

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import type { Osu } from "$lib/osu";


const sqlite = createClient({ url: 'file:./db/dev.db' });
export const db = drizzle(sqlite);

const earliest = new Date("2024-05-28");
console.log(earliest);

const token = await db
  .select({ token: OauthToken.access_token })
  .from(OauthToken)
  .innerJoin(User, eq(User.id, OauthToken.user_id))
  .where(eq(User.username, 'clx'));


const getBeatmaps = async (created: number, access_token: string, cursor_string?: string): Promise<{ beatmapsets: Osu.Beatmapset[], cursor_string: string | null }> => {
  const params = new URLSearchParams();
  if (cursor_string) {
    params.set('cursor_string', cursor_string);
  } else {
    params.set('q', `ranked<${created}`);
  }

  const beatmapSets = await fetch(`https://osu.ppy.sh/api/v2/beatmapsets/search?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${access_token}`
    }
  });
  return await beatmapSets.json();
};

const addMap = async (map: Osu.BeatmapExtended, set: Osu.Beatmapset, mods?: string) => {
  const obj: typeof Map.$inferInsert = {
    id: map.id,
    beatmapset_id: map.beatmapset_id,
    title: set.title,
    artist: set.artist,
    difficulty_name: map.version,
    url: map.url,
    gamemode: map.mode,
    square_url: set.covers['list@2x'],
    banner_url: set.covers['card@2x'],
    status: set.status,
    max_combo: map.max_combo,
    last_updated: new Date(map.last_updated),
    available: map.is_scoreable,
    fetch_time: new Date()
  };

  const stats: typeof MapStats.$inferInsert = {
    map_id: map.id,
    length: map.total_length,
    bpm: map.bpm,
    star_rating: map.difficulty_rating,
    cs: map.cs,
    od: map.accuracy,
    ar: map.ar,
    hp: map.drain,
    mod_string: mods ?? ''
  };

  const mapObj = await db.select({ id: Map.id }).from(Map).where(eq(Map.id, map.id));
  if (mapObj.length == 0) {
    await db.insert(Map).values(obj);
  } else {
    await db.update(Map).set(obj).where(eq(Map.id, map.id));
  }

  const statsObj = await db
    .select({ sr: MapStats.star_rating })
    .from(MapStats)
    .where(and(eq(MapStats.map_id, map.id), eq(MapStats.mod_string, mods ?? '')));
  if (statsObj.length == 0) {
    await db.insert(MapStats).values(stats);
  } else {
    await db
      .update(MapStats)
      .set(stats)
      .where(and(eq(MapStats.map_id, map.id), eq(MapStats.mod_string, mods ?? '')));
  }

  return db
    .select()
    .from(Map)
    .where(eq(Map.id, map.id))
    .innerJoin(MapStats, eq(MapStats.map_id, map.id));
};

console.log(earliest.valueOf() / 1000);
let maps = await getBeatmaps(earliest.valueOf() / 1000, token[0].token);

while (maps.cursor_string != null) {
  for (const set of maps.beatmapsets) {
    if (set.beatmaps) {
      for (const map of set.beatmaps) {
        console.log(`Adding https://osu.ppy.sh/b/${map.id}`)
        await addMap((map as Osu.BeatmapExtended), set)
      }
    }
  }

  if (maps.cursor_string) {
    console.log("Fetching more maps...");
    await new Promise(resolve => setTimeout(resolve, 3000))
    maps = await getBeatmaps(earliest.valueOf() / 1000, token[0].token, maps.cursor_string);
  }
}