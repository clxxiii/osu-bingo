import { OauthToken, User, Map, MapStats } from "$lib/drizzle/schema"
import { and, count, eq } from "drizzle-orm"

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import type { Osu } from "$lib/osu";


const sqlite = createClient({ url: 'file:./db/dev.db' });
export const db = drizzle(sqlite);

const POPULAR_CUTOFF = 300
const TOTAL = 10_000 // Change this when starting from a new date (adding newer maps)

// Next time you run this script, set the `earlier` property to the current date, 
// to only fetch maps that weren't ranked when this script ran.
// Current Date: 2024-07-12T06:01:36.957Z

const current = new Date();
const earliest = new Date("2007-10-06"); // Date of the first osu map (disco prince)

const token = await db
  .select({ token: OauthToken.access_token })
  .from(OauthToken)
  .innerJoin(User, eq(User.id, OauthToken.user_id))


const run = async () => {
  let count = await getCount();
  console.log('Seeding Database with new maps!')

  // Top 3000 popular maps
  if (count == 0) {

    console.log("Fetching popular maps...")
    let maps = await getPopularMaps(token[0].token)
    while (count < POPULAR_CUTOFF) {
      await addMaps(maps.beatmapsets);
      count = await getCount()
      if (count >= POPULAR_CUTOFF) {
        console.log("Finished popular maps.")
        break;
      } else if (!maps.cursor_string) {
        console.log('Ran out of popular maps');
        break;
      }
      console.log("Continuing with cursor string...")
      maps = await getPopularMaps(token[0].token, maps.cursor_string)
    }
  } else {
    console.log("Database already has maps, skipping popular map seeding!")
  }

  // Random maps
  while (count < TOTAL) {
    const date = randomDate();
    console.log("Fetching latest maps as of " + date.toISOString())
    const maps = await getBeatmaps(date.valueOf() / 1000, token[0].token);
    await addMaps(maps.beatmapsets);
    count = await getCount()
    if (count >= TOTAL) {
      console.log("Finished popular maps.")
      break;
    }

    console.log("Fetching more maps...");
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log("Done!")
  console.log("Next time you run this script, set the `earlier` property to the current date, ")
  console.log("to only fetch maps that weren't ranked when this script ran.")
  console.log(`Current Date: ${current.toISOString()}`)
}

const getCount = async () => {
  const mapCount = (await db
    .select({ count: count() })
    .from(Map))[0]

  return mapCount.count;
}

const getBeatmaps = async (created: number, access_token: string, cursor_string?: string): Promise<{ beatmapsets: Osu.Beatmapset[], cursor_string: string | null }> => {
  const params = new URLSearchParams();
  if (cursor_string) {
    params.set('cursor_string', cursor_string);
  } else {
    params.set('q', `ranked<${created}`);
  }

  await new Promise(r => setTimeout(r, 1000));
  const beatmapSets = await fetch(`https://osu.ppy.sh/api/v2/beatmapsets/search?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${access_token}`
    }
  });
  return await beatmapSets.json();
};

const getPopularMaps = async (access_token: string, cursor_string?: string): Promise<{ beatmapsets: Osu.Beatmapset[], cursor_string: string | null }> => {
  const params = new URLSearchParams();
  if (cursor_string) {
    params.set('cursor_string', cursor_string);
  }
  params.set('sort', `plays_desc`);

  await new Promise(r => setTimeout(r, 1000));
  const beatmapSets = await fetch(`https://osu.ppy.sh/api/v2/beatmapsets/search?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${access_token}`
    }
  });
  return await beatmapSets.json();
}

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

const addMaps = async (sets: Osu.Beatmapset[]) => {
  const localCount = sets
    .map(x => x.beatmaps?.length ?? 0)
    .reduce((sum, x) => sum += x)
  console.log(`Adding ${localCount} new fetched maps...`)
  for (const set of sets) {
    if (set.beatmaps) {
      for (const map of set.beatmaps) {
        await addMap((map as Osu.BeatmapExtended), set)
      }
    }
  }
}

const randomDate = () => {
  const rand = expStabilizer(Math.random());

  const difference = current.valueOf() - earliest.valueOf();
  return new Date(current.valueOf() - (difference * rand));
}

// https://www.desmos.com/calculator/xzkz7xqxnr
const expStabilizer = (x: number) => {
  const a = 0.215290309487;
  const b = 5.64489090282;
  const c = -0.215290309487;

  return (a * Math.pow(b, x)) + c;
}

run()