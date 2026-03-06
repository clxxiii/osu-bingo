mod osu_oauth;

use std::sync::Arc;
use tokio::sync::Mutex;

use axum::{Router, extract::Extension};

use crate::database::Database;

pub async fn router() -> Router {
    Router::new()
        .nest("/osu", osu_oauth::router().await)
        .layer(Extension(Arc::new(Mutex::new(Database::new()))))
}
