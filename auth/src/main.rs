use bingo_auth::routes::router;
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    let router = router().await;

    // Get port from environment, or default 3100
    let port: u16 = std::env::var("PORT")
        .unwrap_or(String::from("3100"))
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
    colog::default_builder()
        .format_timestamp_secs()
        .format_file(true)
        .filter_level(log::LevelFilter::Trace)
        .init();

    log::info!("Opened a connection at {}", addr);
    axum::serve(listener, router).await.unwrap();
}
