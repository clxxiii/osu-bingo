ALTER TABLE `MapInPool` RENAME COLUMN `` TO `required_mods`;--> statement-breakpoint
ALTER TABLE `Score` ADD `claim` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `Template` ADD `description` text;--> statement-breakpoint

-- Recreate BingoGame table 
PRAGMA foreign_keys=OFF; --> statement-breakpoint
CREATE TABLE `new_BingoGame` (
	`id` text PRIMARY KEY NOT NULL,
  `name` text,
	`winning_team` text,
	`link_id` text,
	`start_time` integer,
	`end_time` integer,
	`state` integer DEFAULT 0 NOT NULL,
	`public` integer DEFAULT true NOT NULL,
	`allow_team_switching` integer DEFAULT true,
  `options` text DEFAULT '{"setup":{"stars":{"min_sr":4,"max_sr":5},"length":{"min":0,"max":200}}}' NOT NULL,
	`template_id` text,
	FOREIGN KEY (`template_id`) REFERENCES `Template`(`id`) ON UPDATE no action ON DELETE no action
); --> statement-breakpoint

-- Add old entries
INSERT INTO `new_BingoGame` 
  (`id`, `winning_team`, `link_id`, `start_time`, `state`, `public`, `allow_team_switching`, `template_id`) SELECT 
  `id`, `winning_team`, `link_id`, `start_time`, `state`, `public`, `allow_team_switching`, `template_id` 
  FROM "BingoGame"; --> statement-breakpoint

-- Combine old properties into options json
UPDATE `new_BingoGame`
SET options = (
  SELECT '{"setup": {"claim_condition": {"metric": "' || claim_condition || '"}, "reclaim_condition": "' || tiebreaker || '", "stars": {"min": ' || IFNULL(min_sr, 0.0) || ', "max": ' || IFNULL(max_sr, 10.0) || '}, "length": {"min": ' || IFNULL(min_length, 0) || ',"max": ' || IFNULL(max_length, 300) || '}}}' options 
  FROM BingoGame
  WHERE new_BingoGame.id = BingoGame.id
); --> statement-breakpoint

UPDATE `new_BingoGame`
SET name = (
  SELECT 'Game ' || link_id
  FROM BingoGame
  WHERE new_BingoGame.id = BingoGame.id
); --> statement-breakpoint

-- Drop old table and rename new table
DROP TABLE "BingoGame"; --> statement-breakpoint
ALTER TABLE "new_BingoGame" RENAME TO "BingoGame"; --> statement-breakpoint
PRAGMA foreign_key_check; --> statement-breakpoint
PRAGMA foreign_keys=ON;