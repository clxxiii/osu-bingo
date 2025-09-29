use axum::{
    extract::{Extension, Json},
    response::{IntoResponse, Response},
};
use chrono::{DateTime, Utc};
use jsonwebkey::{self as jwk, JsonWebKey};
use reqwest::StatusCode;
use serde::Serialize;

use crate::database::{self, Context, Database};

#[derive(Serialize)]
struct JwkResponse {
    keys: Vec<JsonWebKey>,
    expirys: Vec<DateTime<Utc>>,
}

pub async fn create_jwt(Extension(ctx): Extension<Context>) -> Response {
    let mut db = ctx.lock().await;
    let key = get_latest_key(&mut db).await.unwrap();
    Response::builder()
        .status(StatusCode::NO_CONTENT)
        .body(key.to_string().into())
        .unwrap()
}

pub async fn list_keys(Extension(ctx): Extension<Context>) -> Response {
    let mut db = ctx.lock().await;
    let keys = db.get_all_keys().await.unwrap();

    let mut expiry_map: Vec<DateTime<Utc>> = Vec::new();
    for key in keys.iter().clone() {
        expiry_map.push(key.expires_at);
    }

    let public_keys: Vec<JsonWebKey> = keys
        .iter()
        .map(|x| x.jwk_key.parse::<JsonWebKey>().unwrap())
        .filter(|x| x.key.is_private())
        .map(|x| {
            x.key
                .to_public()
                .expect("Non-private keys are filtered already")
                .into_owned()
        })
        .map(|x| JsonWebKey::new(x))
        .collect();

    Json(JwkResponse {
        keys: public_keys,
        expirys: expiry_map,
    })
    .into_response()
}

async fn get_latest_key(db: &mut Database) -> Result<JsonWebKey, String> {
    let key = db.get_latest_key().await?;

    match key {
        Some(x) => x.jwk_key.parse::<JsonWebKey>().map_err(|x| x.to_string()),
        None => {
            let mut jwk_key = JsonWebKey::new(jwk::Key::generate_p256());
            jwk_key.key_id = Some(database::id::generate("key"));
            db.insert_key(&jwk_key.clone().into()).await?;
            Ok(jwk_key)
        }
    }
}
