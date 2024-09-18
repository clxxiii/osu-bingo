import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { Map, MapStats } from '../schema';
import type { Osu } from '$lib/osu';
import { logger } from '$lib/logger';

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

	logger.silly('Started db request', { function: 'addMap', obj: 'mapObj', dir: 'start' });
	const mapObj = await db.select({ id: Map.id }).from(Map).where(eq(Map.id, map.id));
	logger.silly('Finished db request', { function: 'addMap', obj: 'mapObj', dir: 'end' });
	if (mapObj.length == 0) {
		logger.silly('Started db request', { function: 'addMap', obj: 'insert', dir: 'start' });
		await db.insert(Map).values(obj);
		logger.silly('Finished db request', { function: 'addMap', obj: 'insert', dir: 'end' });
	} else {
		logger.silly('Started db request', { function: 'addMap', obj: 'update', dir: 'start' });
		await db.update(Map).set(obj).where(eq(Map.id, map.id));
		logger.silly('Finished db request', { function: 'addMap', obj: 'update', dir: 'end' });
	}

	logger.silly('Started db request', { function: 'addMap', obj: 'statsObj', dir: 'start' });
	const statsObj = await db
		.select({ sr: MapStats.star_rating })
		.from(MapStats)
		.where(and(eq(MapStats.map_id, map.id), eq(MapStats.mod_string, mods ?? '')));
	logger.silly('Finished db request', { function: 'addMap', obj: 'statsObj', dir: 'end' });
	if (statsObj.length == 0) {
		logger.silly('Started db request', { function: 'addMap', obj: 'insertStats', dir: 'start' });
		await db.insert(MapStats).values(stats);
		logger.silly('Finished db request', { function: 'addMap', obj: 'insertStats', dir: 'end' });
	} else {
		logger.silly('Started db request', { function: 'addMap', obj: 'updateStats', dir: 'start' });
		await db
			.update(MapStats)
			.set(stats)
			.where(and(eq(MapStats.map_id, map.id), eq(MapStats.mod_string, mods ?? '')));
		logger.silly('Finished db request', { function: 'addMap', obj: 'updateStats', dir: 'end' });
	}

	logger.silly('Started db request', { function: 'addMap', obj: 'returnObj', dir: 'start' });
	const returnObj = await db
		.select()
		.from(Map)
		.where(eq(Map.id, map.id))
		.innerJoin(MapStats, eq(MapStats.map_id, map.id));
	logger.silly('Finished db request', { function: 'addMap', obj: 'returnObj', dir: 'end' });
	return returnObj;
};

export const getMap = async (id: number, mods?: string): Promise<Bingo.Card.FullMap> => {
	mods = mods ?? '';

	logger.silly('Started db request', { function: 'getMap', obj: 'map', dir: 'start' });
	const map = (
		await db
			.select()
			.from(Map)
			.innerJoin(MapStats, and(eq(Map.id, MapStats.map_id), eq(MapStats.mod_string, mods)))
			.where(eq(Map.id, id))
	)[0];
	logger.silly('Finished db request', { function: 'getMap', obj: 'map', dir: 'end' });

	return { ...map.Map, stats: map.MapStats };
};
