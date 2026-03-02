use bingolib::structs::OauthToken;
use rosu_v2::prelude::Score;

const BASE_URL: &'static str = "https://osu.ppy.sh/api/v2";

pub async fn update_user_scores(user_token: OauthToken) -> Result<Vec<Score>, ()> {
    let request_client = reqwest::Client::new();
    let req_url = format!("{BASE_URL}/users/{}/scores/recent", user_token.user_id);
    log::debug!("{req_url}");
    let request = request_client.get(req_url).header(
        "Authorization",
        format!("{} {}", user_token.token_type, user_token.access_token),
    );
    log::debug!("{request:?}");
    let request = request.send().await;
    log::debug!("{request:?}");

    let body = match request {
        Ok(body) => body,
        Err(err) => {
            log::error!("Score fetch request failed: {err}");
            return Err(());
        }
    };

    let scores: Vec<Score> = match body.json().await {
        Ok(x) => x,
        Err(err) => {
            log::error!("Failed to parse score fetch request: {err}");
            return Err(());
        }
    };

    return Ok(scores);
}
