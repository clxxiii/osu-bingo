use chrono::{DateTime, Utc};

#[derive(serde::Serialize, serde::Deserialize)]
pub struct OauthToken {
    pub id: String,
    pub user_id: String,
    pub service: String,
    pub access_token: String,
    pub expires_at: DateTime<Utc>,
    pub refresh_token: String,
    pub token_type: String,
}
