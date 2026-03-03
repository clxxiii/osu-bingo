use lapin::Connection;

#[derive(Debug)]
pub enum GetConnectionError {
    MissingEnv,
    ConnectFailure(lapin::Error),
}

pub async fn get_connection() -> Result<Connection, GetConnectionError> {
    let url = match std::env::var("RABBITMQ_URL") {
        Ok(x) => x,
        Err(_) => {
            log::error!("RabbitMQ URL is missing or malformed");
            return Err(GetConnectionError::MissingEnv);
        }
    };

    let conn = match Connection::connect(url.as_str(), lapin::ConnectionProperties::default()).await
    {
        Ok(x) => x,
        Err(err) => {
            log::error!("Failed to connect to RabbitMQ instance at {url}: {err}");
            return Err(GetConnectionError::ConnectFailure(err));
        }
    };

    Ok(conn)
}
