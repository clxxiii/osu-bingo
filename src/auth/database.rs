pub mod id;
pub mod structs;

use sqlx::PgPool;

use std::sync::Arc;
use structs::*;
use tokio::sync::Mutex;

pub struct Database {
    pool: Option<PgPool>,
}

impl Database {
    pub fn new() -> Self {
        Database { pool: None }
    }
    pub async fn connect(&mut self) -> Result<&PgPool, String> {
        // Don't connect if already connected
        if let Some(pool) = self.pool.as_ref() {
            if !pool.is_closed() {
                return self
                    .pool
                    .as_ref()
                    .ok_or("Disconnected from Database".into());
            }
        }

        let db_url = std::env::var("AUTH_DATABASE_URL");
        match db_url {
            Ok(url) => {
                self.pool = Some(PgPool::connect(&url).await.unwrap());
            }
            Err(_) => (),
        };

        self.pool
            .as_ref()
            .ok_or("Disconnected from Database".into())
    }
}

pub type Context = Arc<Mutex<Database>>;
