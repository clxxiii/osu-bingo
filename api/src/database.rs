use std::collections::HashMap;

use tokio::sync::{RwLock, RwLockWriteGuard};

use serde::{Serialize, de::DeserializeOwned};
use serde_json::Value;
use sqlx::PgPool;

use super::schema::*;

pub struct Loader {
    pool: PgPool,
    cache: HashMap<String, Value>,
}

impl<'a> Loader {
    fn new(pool: PgPool) -> Self {
        Loader {
            pool,
            cache: HashMap::new(),
        }
    }

    pub async fn get_public_games(&mut self) -> Result<Vec<BingoGame>, String> {
        get_cached_value(String::from("all_games"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM bingo_game WHERE public = true;")
                .fetch_all(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_game_squares(&mut self, id: &str) -> Result<Vec<BingoSquare>, String> {
        get_cached_value(format!("game_squares_{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM bingo_square WHERE game_id = $1;")
                .bind(id)
                .fetch_all(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_map_squares(&mut self, id: i32) -> Result<Vec<BingoSquare>, String> {
        get_cached_value(format!("map_squares_{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM bingo_square WHERE map_id = $1;")
                .bind(id)
                .fetch_all(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    // TODO: Authorization
    pub async fn get_game_by_id(&mut self, id: &str) -> Result<BingoGame, String> {
        get_cached_value(format!("game_{}", id), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM bingo_game WHERE id = $1;")
                .bind(&id)
                .fetch_one(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_game_users(&mut self, id: &str) -> Result<Vec<GameUser>, String> {
        get_cached_value(
            format!("game_gameusers_{id}"),
            &mut self.cache,
            async || {
                sqlx::query_as("SELECT * FROM game_user WHERE game_id = $1;")
                    .bind(id)
                    .fetch_all(&self.pool)
                    .await
                    .map_err(|e| e.to_string())
            },
        )
        .await
    }

    pub async fn get_template_from_id(&mut self, id: &str) -> Result<Template, String> {
        get_cached_value(format!("{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM template WHERE id = $1;")
                .bind(&id)
                .fetch_one(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_square_scores(&mut self, id: &str) -> Result<Vec<Score>, String> {
        get_cached_value(format!("square_scores_{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM score WHERE square_id = $1;")
                .bind(id)
                .fetch_all(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_gameuser_by_id(&mut self, id: &str) -> Result<GameUser, String> {
        get_cached_value(format!("{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM gameuser where id = $1;")
                .bind(id)
                .fetch_one(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_user_by_id(&mut self, id: i32) -> Result<User, String> {
        get_cached_value(format!("user_{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM public.user where id = $1;")
                .bind(id)
                .fetch_one(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_user_gameusers(&mut self, id: i32) -> Result<Vec<GameUser>, String> {
        get_cached_value(
            format!("user_gameusers_{id}"),
            &mut self.cache,
            async || {
                sqlx::query_as("SELECT * FROM gameuser where user_id = $1;")
                    .bind(id)
                    .fetch_all(&self.pool)
                    .await
                    .map_err(|e| e.to_string())
            },
        )
        .await
    }

    pub async fn get_user_chats(&mut self, id: i32) -> Result<Vec<Chat>, String> {
        get_cached_value(format!("user_chats_{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM chat where user_id = $1;")
                .bind(id)
                .fetch_all(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_user_templates(&mut self, id: i32) -> Result<Vec<Template>, String> {
        get_cached_value(
            format!("user_templates_{id}"),
            &mut self.cache,
            async || {
                sqlx::query_as("SELECT * FROM template where owner_id = $1;")
                    .bind(id)
                    .fetch_all(&self.pool)
                    .await
                    .map_err(|e| e.to_string())
            },
        )
        .await
    }

    pub async fn get_map_by_id(&mut self, id: i32) -> Result<Map, String> {
        get_cached_value(format!("map_{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM map where id = $1;")
                .bind(id)
                .fetch_one(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_map_stats(&mut self, id: i32) -> Result<Vec<MapStats>, String> {
        get_cached_value(format!("stats_{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM map_stats where map_id = $1;")
                .bind(id)
                .fetch_all(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_mappool_by_id(&mut self, id: &str) -> Result<Mappool, String> {
        get_cached_value(format!("{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM mappool where id = $1;")
                .bind(id)
                .fetch_one(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_square_by_id(&mut self, id: &str) -> Result<BingoSquare, String> {
        get_cached_value(format!("{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM bingo_square where id = $1;")
                .bind(id)
                .fetch_one(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_maps_in_mappool(&mut self, id: &str) -> Result<Vec<MapInPool>, String> {
        get_cached_value(format!("{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM map_in_pool where pool_id = $1;")
                .bind(id)
                .fetch_all(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_mapinpool_by_map(&mut self, id: i32) -> Result<Vec<MapInPool>, String> {
        get_cached_value(format!("stats_{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM map_in_pool where map_id = $1;")
                .bind(id)
                .fetch_all(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }

    pub async fn get_mapinpool_by_pool(&mut self, id: &str) -> Result<Vec<MapInPool>, String> {
        get_cached_value(format!("stats_{id}"), &mut self.cache, async || {
            sqlx::query_as("SELECT * FROM map_in_pool where pool_id = $1;")
                .bind(id)
                .fetch_all(&self.pool)
                .await
                .map_err(|e| e.to_string())
        })
        .await
    }
}

async fn get_cached_value<T, F>(
    query_key: String,
    cache: &mut HashMap<String, Value>,
    fetcher: F,
) -> Result<T, String>
where
    T: Serialize + DeserializeOwned,
    F: AsyncFnOnce() -> Result<T, String>,
{
    if !cache.contains_key(&query_key) {
        let value: T = fetcher().await?;

        cache.insert(
            query_key.clone(),
            serde_json::to_value(value).map_err(|x| x.to_string())?,
        );
    }

    let query = cache.get(&query_key);
    if let Some(content) = query {
        return serde_json::from_value(content.clone()).map_err(|x| x.to_string());
    }

    return Err(String::from("Insert into hashmap must have failed"));
}

pub async fn pool() -> PgPool {
    let db_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
        eprintln!("Environment variable DATABASE_URL should be set");
        std::process::exit(1);
    });

    PgPool::connect(&db_url).await.unwrap()
}

pub struct DataContext(RwLock<Loader>);
impl DataContext {
    pub fn new(pool: PgPool) -> Self {
        DataContext(RwLock::new(Loader::new(pool)))
    }
    pub async fn acquire(&self) -> RwLockWriteGuard<'_, Loader> {
        self.0.write().await
    }
}

impl juniper::Context for DataContext {}
