use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::database;

#[derive(sqlx::FromRow, Deserialize, Serialize)]
pub struct Session {
    id: String,
    user_id: i32,

    token: String,

    created_at: DateTime<Utc>,
    last_used: Option<DateTime<Utc>>,
}

#[derive(sqlx::FromRow, Deserialize, Serialize)]
pub struct OauthToken {
    id: String,
    user_id: String,
    service: String,
    access_token: String,
    expires_at: DateTime<Utc>,
    refresh_token: String,
    token_type: String,
}

#[derive(sqlx::FromRow, Deserialize, Serialize)]
pub struct SigningKey {
    pub id: String,
    pub jwk_key: String,
    pub expires_at: DateTime<Utc>,
}

impl From<jsonwebkey::JsonWebKey> for SigningKey {
    fn from(value: jsonwebkey::JsonWebKey) -> Self {
        SigningKey {
            id: database::id::generate("key"),
            jwk_key: value.to_string(),
            expires_at: chrono::Utc::now() + chrono::Duration::seconds(60),
        }
    }
}
