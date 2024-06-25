import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { Map, MapStats } from '../schema';
import type { Osu } from '$lib/osu';

export const addMap = async (map: Osu.BeatmapExtended, set: Osu.Beatmapset, mods?: string) => {
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

export const getMap = async (id: number, mods?: string): Promise<Bingo.Card.FullMap> => {
	mods = mods ?? '';

	const map = (await db.select()
		.from(Map)
		.innerJoin(MapStats, and(
			eq(Map.id, MapStats.map_id),
			eq(MapStats.mod_string, mods)
		))
		.where(eq(Map.id, id)))[0]


	return { ...map.Map, stats: map.MapStats }
}