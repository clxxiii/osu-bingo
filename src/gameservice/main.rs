use std::process::exit;

use bingolib::rabbit::get_connection;

mod functions;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    // Logger
    if std::env::var("RUST_LOG").is_err() {
        unsafe { std::env::set_var("RUST_LOG", "info") }
    }
    env_logger::init();

    let conn = match get_connection().await {
        Ok(x) => x,
        Err(err) => {
            //TODO: If error is reccoverable, keep trying to reconnect
            panic!("failed to connect to Rabbit: {err:?}")
        }
    };

    let channel = match conn.create_channel().await {
        Ok(x) => x,
        Err(err) => {
            panic!("failed to create Rabbit Channel: {err:?}")
        }
    };

    match functions::register_consumers(&channel).await {
        Ok(_) => (),
        Err(err) => {
            panic!("Failed to register one or multiple consumers: {err}")
        }
    };

    log::info!("RabbitMQ Initialized!");
    match conn.run() {
        Ok(_) => {}
        Err(err) => {
            log::error!("{err}");
            exit(1);
        }
    }
}
