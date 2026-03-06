use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

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
