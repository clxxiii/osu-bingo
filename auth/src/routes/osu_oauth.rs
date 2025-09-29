use std::collections::HashMap;

use axum::{extract::Query, response::{Redirect, Response}, routing::get, Router};
use bingolib::QueryParams;
use serde::Deserialize;

const OSU_LOGIN_URL: &str = "https://osu.ppy.sh/oauth/authorize";
const OSU_TOKEN_URL: &str = "https://osu.ppy.sh/oauth/token";

#[derive(Deserialize)]
struct Code {
    code: String
}

#[derive(Deserialize, Debug)]
struct AccessToken {
    access_token: String,
    expires_in: i32,
    refresh_token: String,
    token_type: String
}

pub async fn router() -> Router {
    Router::new()
        .route("/login", get(login))
        .route("/callback", get(callback))
        .route("/logout", get(logout))
}

async fn login() -> Redirect {
    let OSU_CLIENT_ID = std::env::var("OSU_CLIENT_ID").expect("OSU_CLIENT_ID environment variable should be defined");
    let OSU_REDIRECT_URI = std::env::var("OSU_REDIRECT_URI").expect("OSU_REDIRECT_URI environment variable should be defined");

    let mut params = QueryParams::new();
    params.insert("client_id", &OSU_CLIENT_ID);
    params.insert("redirect_uri", &OSU_REDIRECT_URI);
    params.insert("scope", "identify");
    params.insert("response_type", "code");
    let url = format!("{}?{}", OSU_LOGIN_URL, params);
    Redirect::to(&url)
}

async fn callback(query: Query<Code>) -> Response {
    let OSU_CLIENT_ID = std::env::var("OSU_CLIENT_ID").expect("OSU_CLIENT_ID environment variable should be defined");
    let OSU_CLIENT_SECRET = std::env::var("OSU_CLIENT_SECRET").expect("OSU_CLIENT_SECRET environment variable should be defined");
    let OSU_REDIRECT_URI = std::env::var("OSU_REDIRECT_URI").expect("OSU_REDIRECT_URI environment variable should be defined");

    let req_client = reqwest::Client::new();
    let mut body = HashMap::new();
    body.insert("grant_type", "authorization_code");
    body.insert("client_id", &OSU_CLIENT_ID);
    body.insert("client_secret", &OSU_CLIENT_SECRET);
    body.insert("code", &query.code);
    body.insert("redirect_uri", &OSU_REDIRECT_URI);
    println!("{}", query.code);

    let token: AccessToken = match req_client
        .post(OSU_TOKEN_URL)
        .header("Accept", "application/json")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .form(&body)
        .send()
        .await 
    {
        Ok(req) => {
            match req.json().await {
                Ok(x) => {
                    x
                },
                Err(x) => {
                    return error_to_response(x)
                }
            }
        },
        Err(x) =>  {
           return error_to_response(x) 
        }
    };

    println!("{:?}", token);
        
    
    Response::new("".into())
}

async fn logout() {}

fn error_to_response(err: reqwest::Error) -> Response {
    Response::builder()
        .status(err.status().unwrap_or(reqwest::StatusCode::INTERNAL_SERVER_ERROR))
        .body(axum::body::Body::from(err.to_string()))
        .unwrap()
}
