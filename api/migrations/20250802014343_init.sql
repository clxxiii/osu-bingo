-- Add migration script here
BEGIN;

CREATE TYPE game_state AS ENUM ('BeforeStarting', 'InGame', 'FinalShowdown', 'Finished');
CREATE TYPE ruleset AS ENUM ('fruits', 'mania', 'osu', 'taiko');
CREATE TYPE claim_action AS ENUM ('NoChange', 'Claim', 'ReClaim', 'Win');

---

CREATE TABLE public."user" (
    id INTEGER PRIMARY KEY NOT NULL,
    username VARCHAR(16) NOT NULL,
    country_code CHAR(2) NOT NULL,
    country_name VARCHAR(50) NOT NULL,
    cover_url VARCHAR(256) NOT NULL,
    avatar_url VARCHAR(256) NOT NULL,
    pp REAL,
    global_rank INTEGER,
    country_rank INTEGER,
    total_score INT8,
    ranked_score INT8,
    hit_accuracy REAL,
    play_count INTEGER,
    level INTEGER,
    level_progress INTEGER,
    last_refreshed TIMESTAMPTZ
);

CREATE TABLE session (
    id CHAR(16) PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL REFERENCES public."user"(id) ON UPDATE cascade ON DELETE cascade,
    token text NOT NULL UNIQUE,
    created_at TIMESTAMPTZ,
    last_used TIMESTAMPTZ,
    device TEXT,
    browser TEXT,
    os TEXT
);

CREATE TABLE oauth_token (
    id CHAR(16) PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES public."user"(id) ON UPDATE cascade ON DELETE cascade,
    service VARCHAR(20) NOT NULL,
    access_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    refresh_token TEXT NOT NULL UNIQUE,
    token_type TEXT NOT NULL
);

---

CREATE TABLE mappool (
    id CHAR(16) PRIMARY KEY NOT NULL,
    name VARCHAR(100)
);

CREATE TABLE map (
   id INTEGER PRIMARY KEY NOT NULL,
   beatmapset_id INTEGER NOT NULL,
   fetch_time TIMESTAMPTZ NOT NULL,
   gamemode ruleset DEFAULT 'osu' NOT NULL,
   title TEXT NOT NULL,
   artist TEXT NOT NULL,
   difficulty_name TEXT NOT NULL,
   url VARCHAR(256) NOT NULL,
   square_url VARCHAR(256) NOT NULL,
   banner_url VARCHAR(256) NOT NULL,
   status VARCHAR(25) NOT NULL,
   max_combo INTEGER NOT NULL,
   last_updated TIMESTAMPTZ NOT NULL,
   available BOOLEAN NOT NULL
);

CREATE TABLE map_stats (
  	map_id INTEGER NOT NULL REFERENCES map(id) ON UPDATE cascade ON DELETE cascade,
  	mod_string VARCHAR(20) DEFAULT '' NOT NULL,
  	star_rating REAL NOT NULL,
  	bpm REAL NOT NULL,
  	length INTEGER NOT NULL,
  	cs REAL NOT NULL,
  	ar REAL NOT NULL,
  	od REAL NOT NULL,
  	hp REAL NOT NULL,

  	PRIMARY KEY(map_id, mod_string)
);

CREATE TABLE map_in_pool (
   id CHAR(16) PRIMARY KEY NOT NULL,
   pool_id CHAR(16) REFERENCES mappool(id),
   map_id INTEGER REFERENCES map(id),
   required_mods VARCHAR(20)
);

---

CREATE TABLE template (
    id CHAR(16) PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL REFERENCES public."user"(id),
    name VARCHAR(50),
    data TEXT NOT NULL,
    description TEXT
);

CREATE TABLE bingo_game (
	id CHAR(16) PRIMARY KEY NOT NULL,
    name VARCHAR(50),
	winning_team VARCHAR(25),
	link_id CHAR(4),
	start_time TIMESTAMPTZ,
	end_time TIMESTAMPTZ,
	state game_state DEFAULT 'BeforeStarting' NOT NULL,
	public BOOLEAN DEFAULT true NOT NULL,
	allow_team_switching BOOLEAN DEFAULT true NOT NULL,
    options TEXT DEFAULT '{"setup":{"stars":{"min_sr":4,"max_sr":5},"length":{"min":0,"max":200}}}' NOT NULL,
	template_id CHAR(16) REFERENCES template(id)
);

CREATE TABLE game_user (
   id CHAR(16) PRIMARY KEY NOT NULL,
   game_id CHAR(16) NOT NULL REFERENCES bingo_game(id) ON UPDATE cascade ON DELETE cascade,
   user_id INTEGER NOT NULL REFERENCES public."user"(id) ON UPDATE cascade ON DELETE cascade,
   team_name CHAR(25) NOT NULL,
   host BOOLEAN DEFAULT false NOT NULL
);

CREATE TABLE bingo_square (
 	id CHAR(16) PRIMARY KEY NOT NULL,
 	game_id CHAR(16) NOT NULL REFERENCES bingo_game(id) ON UPDATE cascade ON DELETE cascade,
 	map_id INT NOT NULL REFERENCES map(id) ON UPDATE cascade ON DELETE cascade,
 	mod_string VARCHAR(20) NOT NULL DEFAULT '',
 	x_pos INT2 NOT NULL,
 	y_pos INT2 NOT NULL,
 	claimed_by_id CHAR(16) REFERENCES game_user(id)
 );

 CREATE TABLE chat (
    id CHAR(16) PRIMARY KEY NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    text TEXT,
    channel VARCHAR(25) DEFAULT 'GLOBAL' NOT NULL,
    game_id CHAR(16) NOT NULL REFERENCES bingo_game(id) ON UPDATE cascade ON DELETE cascade,
    user_id integer NOT NULL REFERENCES public."user"(id)
 );


CREATE TABLE score (
    id CHAR(16) PRIMARY KEY NOT NULL,
    score_id INT8 UNIQUE,
    user_id INTEGER NOT NULL REFERENCES public."user"(id) ON UPDATE cascade ON DELETE cascade,
    date TIMESTAMPTZ NOT NULL,
    percentage REAL,
    is_fc BOOLEAN DEFAULT false NOT NULL,
    score INTEGER NOT NULL,
    pp REAL,
    grade VARCHAR(4) NOT NULL,
    accuracy REAL NOT NULL,
    max_combo INTEGER NOT NULL,
    mods VARCHAR(20) DEFAULT '',
    lazer BOOLEAN NOT NULL,
    important BOOLEAN DEFAULT false,
    claim claim_action DEFAULT 'NoChange' NOT NULL,
    square_id CHAR(16) NOT NULL REFERENCES bingo_square(id) ON UPDATE cascade ON DELETE cascade,
    game_user_id text NOT NULL REFERENCES game_user(id)
);

CREATE TABLE time_event (
    id CHAR(16) PRIMARY KEY NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    action TEXT NOT NULL,
    fulfilled BOOLEAN DEFAULT false,
    game_id CHAR(16) NOT NULL REFERENCES bingo_game(id) ON UPDATE cascade ON DELETE cascade
);

 COMMIT;
