use bingo_api::routes::router;
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    let router = router().await;

    // Get port from environment, or default 3000
    let port: u16 = std::env::var("PORT")
        .unwrap_or(String::from("3000"))
        .parse::<u16>()
        .expect("Supplied port variable cannot be parsed into an integer");
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    let listener = tokio::net::TcpListener::bind(addr).await.expect(
        format!(
            "Address {} should be available so a connection can be opened",
            addr
        )
        .as_str(),
    );

    // Logger
    if std::env::var("RUST_LOG").is_err() {
        unsafe { std::env::set_var("RUST_LOG", "info") }
    }
    env_logger::init();

    log::info!("Opened a connection at {}", addr);
    axum::serve(listener, router).await.unwrap();
}
