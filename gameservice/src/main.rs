use bingolib::structs::OauthToken;
use chrono::Utc;

mod functions;

#[tokio::main]
async fn main() {
    // Logger
    colog::default_builder()
        .format_timestamp_secs()
        .format_file(true)
        .filter_level(log::LevelFilter::Debug)
        .init();

    let token = OauthToken {
        id: String::from(""),
        access_token: String::from(""),
        refresh_token: String::from(""),
        service: String::from("osu"),
        user_id: String::from(""),
        token_type: String::from("Bearer"),
        expires_at: Utc::now(),
    };

    let scores = functions::update_user_scores(token).await;

    println!("{scores:?}");
}
