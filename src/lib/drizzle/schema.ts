/**
 * DRIZZLE SCHEMA
 *
 * - All of the property definitions for the database schema
 * - All relations are specified in `./relations.ts`
 */

import { integer, primaryKey, real, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import ShortUniqueId from 'short-unique-id';
const { randomUUID } = new ShortUniqueId({ length: 12, dictionary: 'alpha' });

/**
 * Represents a game of Bingo
 *
 * Contains references to multiple users, multiple maps (bingo squares), and
 * multiple scores.
 */
export const BingoGame = sqliteTable('BingoGame', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => `gam_${randomUUID()}`),

	name: text('name'),
	winning_team: text('winning_team'),

	// Four letters, similar to a Jackbox invite code
	link_id: text('link_id'),

	// The time the lobby started (or will start), so the game doesn't process scores set before this.
	start_time: integer('start_time', { mode: 'timestamp' }),
	end_time: integer('end_time', { mode: 'timestamp' }),

	// Settings
	// 0: Before starting, 1: In game, 2: Finished, 3: Final Showdown
	state: integer('state').default(0).notNull(),

	public: integer('public', { mode: 'boolean' }).notNull().default(true),

	// Whether or not players are allowed to pick their own team at the start of the game
	allow_team_switching: integer('allow_team_switching', { mode: 'boolean' }).default(true),

	// All other settings are stored in this json object (See the docs: https://notes.clxxiii.dev/1b23f4b9c82c800499bbd95c9fccbbab)
	options: text('options').notNull().default(JSON.stringify({ setup: { stars: { min_sr: 4.0, max_sr: 5.0 }, length: { min: 0, max: 200 } } })),

	template_id: text('template_id').references(() => Template.id)
});

export const BingoSquare = sqliteTable('BingoSquare', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => `sqr_${randomUUID()}`),

	// References
	game_id: text('game_id')
		.references(() => BingoGame.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull(),
	map_id: integer('map_id')
		.references(() => Map.id, { onDelete: 'restrict', onUpdate: 'cascade' })
		.notNull(),
	mod_string: text('mod_string').default(''),

	// Position
	x_pos: integer('x_pos').notNull(),
	y_pos: integer('y_pos').notNull(),

	claimed_by_id: text('claimed_by_id').references(() => GameUser.id)
});

/**
 * Linker table between a game and a user
 */
export const GameUser = sqliteTable('GameUser', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => `gmu_${randomUUID()}`),
	game_id: text('game_id')
		.notNull()
		.references(() => BingoGame.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	user_id: integer('user_id')
		.notNull()
		.references(() => User.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

	team_name: text('team_name').notNull(),
	host: integer('host', { mode: 'boolean' }).notNull().default(false)
});

/**
 * Represents an osu! user
 *
 * id column is shared with osu! id
 */
export const User = sqliteTable('User', {
	id: integer('id').primaryKey().notNull(),

	username: text('username').notNull(),
	country_code: text('country_code').notNull(),
	country_name: text('country_name').notNull(),

	cover_url: text('cover_url').notNull(),
	avatar_url: text('avatar_url').notNull(),

	pp: real('pp'),
	global_rank: integer('global_rank'),
	country_rank: integer('country_rank'),

	total_score: integer('total_score'),
	ranked_score: integer('ranked_score'),
	hit_accuracy: real('hit_accuracy'),
	play_count: integer('play_count'),
	level: integer('level'),
	level_progress: integer('level_progress'),

	last_refreshed: integer('last_refreshed', {
		mode: 'timestamp'
	}).$defaultFn(() => new Date())
});

/**
 * Represents an Oauth token for a user,
 */
export const OauthToken = sqliteTable('OauthToken', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => `tkn_${randomUUID()}`),
	service: text('service').notNull(),
	access_token: text('access_token').unique().notNull(),
	expires_at: integer('expires_at', { mode: 'timestamp' }).notNull(),
	refresh_token: text('refresh_token').unique().notNull(),
	token_type: text('token_type').notNull(),

	user_id: integer('user_id').references(() => User.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	})
});

/**
 * Represents a user's login session.
 */
export const Session = sqliteTable('Session', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => `ses_${randomUUID()}`),
	user_id: integer('user_id')
		.notNull()
		.references(() => User.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

	token: text('token').notNull().unique(), // JWT stored in the browser

	created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	last_used: integer('last_used', { mode: 'timestamp' }),

	// Session Info
	device: text('device'),
	browser: text('browser'),
	os: text('os')
});

/**
 * Represents an event that is scheduled to happen at a certain time.
 *
 */
export const TimeEvent = sqliteTable('TimeEvent', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => `evt_${randomUUID()}`),
	time: integer('time', { mode: 'timestamp' }).notNull(),
	action: text('action').notNull(), // Some string that represents what to do
	// when the time hits
	fulfilled: integer('fulfilled', { mode: 'boolean' }).default(false),

	game_id: text('game_id')
		.notNull()
		.references(() => BingoGame.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

/**
 * Represents multiple maps that come from a similar source (popular maps, random, handpicked etc.)
 */
export const Mappool = sqliteTable('Mappool', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => `mpl_${randomUUID()}`),
	name: text('name')
});

export const MapInPool = sqliteTable('MapInPool', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => `mip_${randomUUID()}`),
	pool_id: text('pool_id').references(() => Mappool.id),
	map_id: integer('map_id').references(() => Map.id),

	required_mods: text('required_mods') // For tournament mappools and such
});

/**
 * Represents a trimmed-down version of a osu! map
 */
export const Map = sqliteTable('Map', {
	id: integer('id').primaryKey(),
	beatmapset_id: integer('beatmapset_id').notNull(),
	fetch_time: integer('fetch_time', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	gamemode: text('gamemode').notNull().default('osu'),

	// Rendered as "title - artist [difficulty_name]" in chat
	title: text('title').notNull(),
	artist: text('artist').notNull(),
	difficulty_name: text('difficulty_name').notNull(),

	// Additional Fields for displaying nicely in a Web format.
	url: text('url').notNull(),
	square_url: text('square_url').notNull(),
	banner_url: text('banner_url').notNull(),
	status: text('status').notNull(),
	max_combo: integer('max_combo').notNull(),
	last_updated: integer('last_updated', { mode: 'timestamp_ms' }).notNull(),

	// Whether a user is able to download
	// using osu!direct/official servers
	available: integer('available', { mode: 'boolean' }).notNull()
});

/**
 * Represents stats about a map
 *
 * Linked to a Map, with some mod_string. For displaying NM stats, DT stats,
 * etc. mod_string should match the string of the MapInPool object ("" means
 * nomod)
 */
export const MapStats = sqliteTable(
	'MapStats',
	{
		map_id: integer('map_id')
			.notNull()
			.references(() => Map.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		mod_string: text('mod_string').default('').notNull(),

		star_rating: real('star_rating').notNull(),
		bpm: real('bpm').notNull(),
		length: integer('length').notNull(), // Length of map in seconds

		cs: real('cs').notNull(),
		ar: real('ar').notNull(),
		od: real('od').notNull(),
		hp: real('hp').notNull()
	},
	(table) => ({
		composite_key: primaryKey({ columns: [table.map_id, table.mod_string] }),
		unique: unique().on(table.map_id, table.mod_string)
	})
);

/**
 * A user's score on a map (MatchBlock)
 *
 * Contains references to a team score (for a team's score)
 */
export const Score = sqliteTable('Score', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => `scr_${randomUUID()}`),
	score_id: integer('score_id'), // https://osu.ppy.sh/s/[score_id]
	user_id: integer('user_id').notNull(),

	date: integer('date', { mode: 'timestamp' }).notNull(),
	percentage: real('percentage'), // If you fail, how far through the map you are.

	is_fc: integer('is_fc', { mode: 'boolean' }).notNull().default(false),
	score: real('score').notNull(),
	pp: real('pp'),
	grade: text('grade').notNull(),
	accuracy: real('accuracy').notNull(),
	max_combo: integer('max_combo').notNull(),
	mods: text('mods').default(''),
	lazer: integer('lazer', { mode: 'boolean' }).notNull(),

	// Whether this score is sufficient to claim a square
	claimworthy: integer('important', { mode: 'boolean' }).default(false),

	// Whether this score had an effect on the state on the board
	// 0: No Change, 1: Claim, 2: Reclaim, 3: Win
	claim: integer('claim').notNull().default(0),

	square_id: text('square_id')
		.notNull()
		.references(() => BingoSquare.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		}),
	game_user_id: text('game_user_id')
		.notNull()
		.references(() => GameUser.id)
});

/**
 * A chat message in a lobby
 */
export const Chat = sqliteTable('Chat', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => `cht_${randomUUID()}`),

	time: integer('time', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	text: text('text'),

	channel: text('channel').notNull().default('GLOBAL'), // 'GLOBAL' or team name ('RED' or 'BLUE')

	game_id: text('game_id')
		.notNull()
		.references(() => BingoGame.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	user_id: integer('user_id')
		.notNull()
		.references(() => User.id)
});

export const Template = sqliteTable('Template', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => `tmt_${randomUUID()}`),
	owner_id: integer('user_id')
		.notNull()
		.references(() => User.id),
	name: text('name'),
	description: text('description'),

	data: text('data').notNull()
});
