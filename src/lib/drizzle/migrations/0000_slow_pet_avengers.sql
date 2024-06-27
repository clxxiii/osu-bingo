CREATE TABLE `BingoGame` (
	`id` text PRIMARY KEY NOT NULL,
	`link_id` text,
	`start_time` integer,
	`state` integer DEFAULT 0 NOT NULL,
	`min_sr` real,
	`max_sr` real,
	`min_length` real,
	`max_length` real,
	`allow_team_switching` integer DEFAULT true,
	`claim_condition` text DEFAULT 'fc' NOT NULL,
	`tiebreaker` text DEFAULT 'score' NOT NULL,
	`public` integer DEFAULT false NOT NULL,
	`template_id` text,
	FOREIGN KEY (`template_id`) REFERENCES `Template`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `BingoSquare` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`map_id` integer NOT NULL,
	`mod_string` text DEFAULT '',
	`x_pos` integer NOT NULL,
	`y_pos` integer NOT NULL,
	`claimed_by_id` text,
	FOREIGN KEY (`game_id`) REFERENCES `BingoGame`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`map_id`) REFERENCES `Map`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`claimed_by_id`) REFERENCES `GameUser`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Chat` (
	`id` text PRIMARY KEY NOT NULL,
	`time` integer NOT NULL,
	`text` text,
	`channel` text DEFAULT 'GLOBAL' NOT NULL,
	`game_id` text NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `BingoGame`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `GameUser` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`user_id` integer NOT NULL,
	`team_name` text NOT NULL,
	`host` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `BingoGame`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Map` (
	`id` integer PRIMARY KEY NOT NULL,
	`beatmapset_id` integer NOT NULL,
	`fetch_time` integer NOT NULL,
	`gamemode` text DEFAULT 'osu' NOT NULL,
	`title` text NOT NULL,
	`artist` text NOT NULL,
	`difficulty_name` text NOT NULL,
	`url` text NOT NULL,
	`square_url` text NOT NULL,
	`banner_url` text NOT NULL,
	`status` text NOT NULL,
	`max_combo` integer NOT NULL,
	`last_updated` integer NOT NULL,
	`available` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `MapStats` (
	`map_id` integer NOT NULL,
	`mod_string` text DEFAULT '' NOT NULL,
	`star_rating` real NOT NULL,
	`bpm` real NOT NULL,
	`length` integer NOT NULL,
	`cs` real NOT NULL,
	`ar` real NOT NULL,
	`od` real NOT NULL,
	`hp` real NOT NULL,
	PRIMARY KEY(`map_id`, `mod_string`),
	FOREIGN KEY (`map_id`) REFERENCES `Map`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `OauthToken` (
	`id` text PRIMARY KEY NOT NULL,
	`service` text NOT NULL,
	`access_token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`refresh_token` text NOT NULL,
	`token_type` text NOT NULL,
	`user_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Score` (
	`id` text PRIMARY KEY NOT NULL,
	`score_id` integer,
	`user_id` integer NOT NULL,
	`date` integer NOT NULL,
	`percentage` real,
	`is_fc` integer DEFAULT false NOT NULL,
	`score` real NOT NULL,
	`pp` real,
	`grade` text NOT NULL,
	`accuracy` real NOT NULL,
	`max_combo` integer NOT NULL,
	`mods` text DEFAULT '',
	`lazer` integer NOT NULL,
	`important` integer DEFAULT false,
	`square_id` text NOT NULL,
	`game_user_id` text NOT NULL,
	FOREIGN KEY (`square_id`) REFERENCES `BingoSquare`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`game_user_id`) REFERENCES `GameUser`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer,
	`last_used` integer,
	`device` text,
	`browser` text,
	`os` text,
	FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Template` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `TimeEvent` (
	`id` text PRIMARY KEY NOT NULL,
	`time` integer NOT NULL,
	`action` text NOT NULL,
	`fulfilled` integer DEFAULT false,
	`game_id` text NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `BingoGame`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`country_code` text NOT NULL,
	`country_name` text NOT NULL,
	`cover_url` text NOT NULL,
	`avatar_url` text NOT NULL,
	`pp` real,
	`global_rank` integer,
	`country_rank` integer,
	`total_score` integer,
	`ranked_score` integer,
	`hit_accuracy` real,
	`play_count` integer,
	`level` integer,
	`level_progress` integer,
	`last_refreshed` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `MapStats_map_id_mod_string_unique` ON `MapStats` (`map_id`,`mod_string`);--> statement-breakpoint
CREATE UNIQUE INDEX `OauthToken_access_token_unique` ON `OauthToken` (`access_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `OauthToken_refresh_token_unique` ON `OauthToken` (`refresh_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `Session_token_unique` ON `Session` (`token`);