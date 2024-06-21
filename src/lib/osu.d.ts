import type { IntegerConfig } from 'drizzle-orm/sqlite-core';

export namespace Osu {
	type AuthScope =
		| 'chat.read'
		| 'chat.write'
		| 'chat.write_manage'
		| 'delegate'
		| 'forum.write'
		| 'friends.read'
		| 'identify'
		| 'public';
	type Ruleset = 'fruits' | 'mania' | 'osu' | 'taiko';

	type TokenResponse = AuthorizationCodeTokenResponse | ClientCredentialsTokenResponse;

	interface AuthorizationCodeTokenResponse {
		access_token: string;
		expires_in: number;
		refresh_token: string;
		token_type: string;
	}
	interface ClientCredentialsTokenResponse {
		access_token: string;
		expires_in: number;
		token_type: string;
	}

	interface User {
		avatar_url: string;
		country_code: string;
		default_group?: string;
		id: number;
		is_active: boolean;
		is_bot: boolean;
		is_deleted: boolean;
		is_online: boolean;
		is_supporter: boolean;
		last_visit?: string;
		pm_friends_only: boolean;
		profile_colour?: string;
		username: string;
		// Optional Attributes
		is_restricted?: boolean;
		kudosu?: User.Kudosu;
		account_history?: User.UserAccountHistory[];
		active_tournament_banners?: User.ProfileBanner[];
		badges?: User.UserBadge[];
		beatmap_playcounts_count?: number;
		country?: {
			code: string;
			name: string;
		};
		cover?: {
			custom_url: string;
			url: string;
			id: any;
		};
		comments_count?: number;
		favourite_beatmapset_count?: number;
		follower_count?: number;
		graveyard_beatmapset_count?: number;
		// groups: any[];
		guest_beatmapset_count?: number;
		loved_beatmapset_count?: number;
		mapping_follower_count?: number;
		monthly_playcounts?: Count[];
		nominated_beatmapset_count?: number;
		page?: {
			html: string;
			raw: string;
		};
		pending_beatmapset_count?: number;
		previous_usernames?: string[];
		rank_highest?: {
			rank: number;
			updated_at: string;
		};
		ranked_beatmapset_count?: number;
		replays_watched_counts?: Count[];
		scores_best_count: number;
		scores_first_count?: number;
		scores_pinned_count?: number;
		scores_recent_count?: number;
		session_verified?: boolean;
		statistics?: UserStatistics;
		statistics_rulesets?: {
			osu: UserStatistics;
			taiko: UserStatistics;
			fruits: UserStatistics;
			mania: UserStatistics;
		};
		support_level?: number;
		user_achievements?: {
			achieved_at: string;
			achievement_id: number;
		}[];
		rank_history?: {
			mode: string;
			data: number[];
		};
		rankHistory?: {
			mode: string;
			data: number[];
		};
		ranked_and_approved_beatmapset_count?: number;
		unranked_beatmapset_count?: number;
	}

	namespace User {
		interface Kudosu {
			available: number;
			total: number;
		}
		interface ProfileBanner {
			id: number;
			tournament_id: number;
			image?: string;
			'image@2x'?: string;
		}
		type ProfilePage =
			| 'me'
			| 'recent_activity'
			| 'beatmaps'
			| 'historical'
			| 'kudosu'
			| 'top_ranks'
			| 'medals';
		interface RankHighest {
			rank: number;
			updated_at: string;
		}
		interface UserAccountHistory {
			description?: string;
			id: number;
			length: number;
			permanent: boolean;
			timestamp: string;
			type: 'note' | 'restriction' | 'silence';
		}

		interface UserBadge {
			awarded_at: string;
			description: string;
			'image@2x_url': string;
			image_url: string;
			url: string;
		}
	}

	interface UserExtended extends User {
		discord?: string;
		has_supported: boolean;
		interests?: string;
		join_date: string;
		location?: string;
		max_blocks: number;
		max_friends: number;
		occupation?: string;
		playmode: string;
		playstyle: string[];
		post_count: number;
		profile_order: ProfilePage[];
		title?: string;
		title_url?: string;
		twitter?: string;
		website?: string;
	}

	type Count = {
		start_date: string;
		count: number;
	};

	interface UserStatistics {
		count_100: number;
		count_300: number;
		count_50: number;
		count_miss: number;
		level: {
			current: number;
			progress: number;
		};
		global_rank?: number;
		global_rank_exp?: number;
		pp: number;
		pp_exp: number;
		ranked_score: number;
		hit_accuracy: number;
		play_count: number;
		play_time: number;
		total_score: number;
		total_hits: number;
		maximum_combo: number;
		replays_watched_by_others: number;
		is_ranked: boolean;
		grade_counts: {
			ss: number;
			ssh: number;
			s: number;
			sh: number;
			a: number;
		};
		country_rank?: number;
		rank: {
			country: number;
		};
	}
	type Grade = 'SSH' | 'SS' | 'SH' | 'S' | 'A' | 'B' | 'C' | 'D' | 'F'
	type ModAbbr =
		'NF' |
		'EZ' |
		'TD' |
		'HD' |
		'HR' |
		'SD' |
		'DT' |
		'RX' |
		'HT' |
		'NC' |
		'FL' |
		'AT' |
		'SO' |
		'AP' |
		'PF' |
		'K4' |
		'K5' |
		'K6' |
		'K7' |
		'K8' |
		'FI' |
		'RD' |
		'CN' |
		'TP' |
		'KC' |
		'K1' |
		'K3' |
		'K2' |
		'MI' |
		'CL'

	interface Beatmapset {
		artist: string;
		artist_unicode: string;
		covers: Covers;
		creator: string;
		favourite_count: number;
		id: number;
		nsfw: boolean;
		offset: number;
		play_count: number;
		preview_url: string;
		source: string;
		status: string;
		spotlight: boolean;
		title: string;
		title_unicode: string;
		user_id: string;
		// optional
		beatmaps?: (Beatmap | BeatmapExtended)[];
	}
	interface Covers {
		cover: string;
		'cover@2x': string;
		card: string;
		'card@2x': string;
		list: string;
		'list@2x': string;
		slimcover: string;
		'slimcover@2x': string;
	}

	interface Beatmap {
		beatmapset_id: number;
		difficulty_rating: number;
		id: number;
		mode: Ruleset;
		status: string;
		total_length: number;
		user_id: number;
		version: string;
		beatmapset?: BeatmapSet;
	}

	interface BeatmapExtended extends Beatmap {
		accuracy: number; // OD
		ar: number;
		bpm: number;
		convert: boolean;
		count_circles: number;
		count_sliders: number;
		count_spinners: number;
		cs: number;
		deleted_at?: string;
		drain: number;
		hit_length: number;
		is_scoreable: boolean;
		last_updated: string;
		mode_int: number;
		passcount: number;
		playcount: number;
		status: number;
		url: string;
		max_combo: number;
	}
	interface Score {
		accuracy: number
		best_id?: number
		created_at?: string
		id: number
		max_combo: number
		mode: Ruleset
		mode_int: number
		mods: ModAbbr[]
		passed: boolean
		perfect: boolean
		pp: number | null
		rank?: string
		replay: boolean
		score: number
		statistics: LegacyStatistics
		type: string
		user_id: number
		beatmap?: BeatmapExtended
		beatmapset?: Beatmapset
		user: User
	}

	interface LegacyStatistics {
		count_100: number
		count_300: number
		count_50: number
		count_geki: number
		count_katu: number
		count_miss: number
	}

	interface LazerScore {
		ranked: boolean
		preserve: boolean
		maximum_statistics?: ScoreStatistics
		mods: { acronym: ModAbbr }[]
		statistics: ScoreStatistics
		beatmap_id: number
		best_id?: number
		id: number
		rank: Grade
		type: string
		user_id: number
		accuracy: number
		build_id?: number
		ended_at: string
		has_replay: boolean
		is_perfect_combo: boolean
		legacy_perect: boolean
		legacy_score_id: number | null
		legacy_total_score: number // 0 if set on lazer
		max_combo: number
		passed: boolean
		playlist_item_id?: number
		pp: number | null
		room_id?: number
		ruleset_id: number
		total_score: number
		replay: boolean

		beatmap?: BeatmapExtended
		beatmapset?: Beatmapset
		user: User
	}

	interface ScoreStatistics {
		great?: number // 300
		ok?: number    // 100
		meh?: number   // 50
		miss?: number  // miss

		// Slider ticks
		large_tick_hit?: number
		large_tick_miss?: number
		// Slider ends
		slider_tail_hit?: number

		// Spinners
		large_bonus?: number
		small_bonus?: number

		// literally no idea
		legacy_combo_increase?: number
		ignore_hit?: number
		ignore_miss?: number
	}
}
