use bingolib::rabbit::get_connection;

mod functions;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    // Logger
    colog::default_builder()
        .format_timestamp_secs()
        .format_file(true)
        .filter_level(log::LevelFilter::Debug)
        .init();

    let mq_conn = match get_connection().await {
        Ok(x) => x,
        Err(err) => {
            //TODO: If error is reccoverable, keep trying to reconnect
            panic!("failed to connect to Rabbit: {err:?}")
        }
    };
}
