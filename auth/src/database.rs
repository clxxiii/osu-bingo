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

    pub async fn get_all_keys(&mut self) -> Result<Vec<SigningKey>, String> {
        let pool = self.connect().await?;
        sqlx::query_as("SELECT * FROM signing_key ;")
            .fetch_all(pool)
            .await
            .map_err(|e| e.to_string())
    }

    pub async fn get_latest_key(&mut self) -> Result<Option<SigningKey>, String> {
        let pool = self.connect().await?;
        // Delete old keys
        let _: Option<()> = sqlx::query_as("DELETE FROM signing_key WHERE expires_at<NOW();")
            .fetch_optional(pool)
            .await
            .map_err(|e| e.to_string())?;

        sqlx::query_as("SELECT * FROM signing_key ORDER BY expires_at DESC;")
            .fetch_optional(pool)
            .await
            .map_err(|e| e.to_string())
    }

    pub async fn insert_key(&mut self, key: &SigningKey) -> Result<(), String> {
        let pool = self.connect().await?;
        sqlx::query_as("INSERT INTO signing_key (id, jwk_key, expires_at) VALUES ($1, $2, $3);")
            .bind(&key.id)
            .bind(&key.jwk_key)
            .bind(&key.expires_at)
            .fetch_optional(pool)
            .await
            .map_err(|e| e.to_string())
            .map(|_: Option<()>| ())
    }
}

pub type Context = Arc<Mutex<Database>>;
