import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { db } from '..';
import { Map, MapInPool, MapStats } from '../schema';
import { logger } from '$lib/logger';

export const getRandomMaps = async (
	pool_id: string,
	size: number,
	min_sr?: number | null,
	max_sr?: number | null,
	min_length?: number | null,
	max_length?: number | null,
	mode?: string | null
) => {
	// Add restrictions for finding maps
	const restrictions = [];
	if (mode) restrictions.push(eq(Map.gamemode, mode));
	if (max_sr) restrictions.push(lte(MapStats.star_rating, max_sr));
	if (min_sr) restrictions.push(gte(MapStats.star_rating, min_sr));
	if (max_length) restrictions.push(lte(MapStats.length, max_length));
	if (min_length) restrictions.push(gte(MapStats.length, min_length));

	logger.silly('Started db request', { function: 'getRandomMaps', obj: 'select', dir: 'start' });
	const select = await db
		.select({ id: Map.id })
		.from(Map)
		.innerJoin(MapInPool, and(eq(MapInPool.pool_id, pool_id), eq(MapInPool.map_id, Map.id)))
		.innerJoin(MapStats, and(eq(Map.id, MapStats.map_id), eq(MapStats.mod_string, '')))
		.where(and(...restrictions, eq(MapInPool.pool_id, pool_id)))
		.limit(size)
		.orderBy(sql`RANDOM()`);
	logger.silly('Finished db request', { function: 'getRandomMaps', obj: 'select', dir: 'end' });
	return select;
};
