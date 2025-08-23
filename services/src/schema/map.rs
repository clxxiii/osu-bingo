use chrono::{DateTime, Utc};
use juniper::{FieldError, FieldResult, graphql_object};
use serde::{Deserialize, Serialize};

use crate::{
    database::DataContext,
    schema::{BingoSquare, MapInPool, MapStats},
};

#[derive(sqlx::FromRow, Serialize, Deserialize)]
pub struct Map {
    id: i32,
    beatmapset_id: i32,
    fetch_time: DateTime<Utc>,
    gamemode: Ruleset,

    title: String,
    artist: String,
    difficulty_name: String,

    url: String,
    square_url: String,
    banner_url: String,
    status: String,
    max_combo: i32,
    last_updated: DateTime<Utc>,

    available: bool,
}

#[derive(sqlx::Type, Deserialize, Serialize, juniper::GraphQLEnum)]
#[sqlx(type_name = "ruleset", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum Ruleset {
    Fruits,
    Mania,
    Osu,
    Taiko,
}

#[graphql_object(description = "Trimmed-down data of a map in osu!'s database", Context = DataContext)]
impl Map {
    /// The beatmap ID from osu! servers
    pub fn id(&self) -> i32 {
        self.id
    }

    /// The set ID the map comes from
    pub fn beatmapset_id(&self) -> i32 {
        self.beatmapset_id
    }

    /// When this map was last fetched from the osu! API
    pub fn fetch_time(&self) -> &DateTime<Utc> {
        &self.fetch_time
    }

    /// The primary mode of the map
    pub fn gamemode(&self) -> &Ruleset {
        &self.gamemode
    }

    /// Name of the song
    pub fn title(&self) -> &str {
        &self.title
    }

    /// Name of the song's creator
    pub fn artist(&self) -> &str {
        &self.artist
    }

    /// Name of the difficulty of this id
    pub fn difficulty_name(&self) -> &str {
        &self.difficulty_name
    }

    /// A link to the beatmap
    pub fn url(&self) -> &str {
        &self.url
    }

    /// A square image of the map's background
    pub fn square_url(&self) -> &str {
        &self.square_url
    }

    /// A rectangular image of the map's background
    pub fn banner_url(&self) -> &str {
        &self.banner_url
    }

    /// Whether the map is ranked, loved, graveyarded etc.
    pub fn status(&self) -> &str {
        &self.status
    }

    /// The maximum combo you can achieve on this map
    pub fn max_combo(&self) -> i32 {
        self.max_combo
    }

    /// When the last update to this map was
    pub fn last_updated(&self) -> &DateTime<Utc> {
        &self.last_updated
    }

    /// Whether or not this map can be downloaded from the osu! API
    pub fn is_available(&self) -> bool {
        self.available
    }

    /// The squares this map is a part of
    pub async fn in_squares(&self, context: &DataContext) -> FieldResult<Vec<BingoSquare>> {
        context
            .acquire()
            .await
            .get_map_squares(self.id)
            .await
            .map_err(FieldError::from)
    }

    /// The pools this map is in
    pub async fn in_pools(&self, context: &DataContext) -> FieldResult<Vec<MapInPool>> {
        context
            .acquire()
            .await
            .get_mapinpool_by_map(self.id)
            .await
            .map_err(FieldError::from)
    }

    /// The stats for every mod combo this map has been used in
    pub async fn stats(&self, context: &DataContext) -> FieldResult<Vec<MapStats>> {
        context
            .acquire()
            .await
            .get_map_stats(self.id)
            .await
            .map_err(FieldError::from)
    }
}
