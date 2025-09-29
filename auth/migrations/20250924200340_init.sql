-- Add migration script here

CREATE TABLE session (
    id CHAR(16) PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    token text NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL,
    last_used TIMESTAMPTZ
);

CREATE TABLE oauth_token (
    id CHAR(16) PRIMARY KEY NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    service VARCHAR(20) NOT NULL,

    access_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    refresh_token TEXT NOT NULL UNIQUE,
    token_type TEXT NOT NULL
);

CREATE TABLE signing_key (
  id CHAR(16) PRIMARY KEY NOT NULL,
  jwk_key TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);
