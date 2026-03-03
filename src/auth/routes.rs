mod jwt;
mod osu_oauth;

use std::sync::Arc;
use tokio::sync::Mutex;

use axum::{Router, extract::Extension, routing::get};

use crate::database::Database;

pub async fn router() -> Router {
    Router::new()
        .route("/", get(jwt::create_jwt))
        .route("/jwks.json", get(jwt::list_keys))
        .nest("/osu", osu_oauth::router().await)
        .layer(Extension(Arc::new(Mutex::new(Database::new()))))
}
