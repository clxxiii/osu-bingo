use juniper::{FieldError, FieldResult, graphql_object};
use serde::{Deserialize, Serialize};

use crate::{database::DataContext, schema::Map};

#[derive(sqlx::FromRow, Serialize, Deserialize)]
pub struct MapStats {
    map_id: i32,
    mod_string: String,

    #[sqlx(try_from = "f32")]
    star_rating: f64,
    #[sqlx(try_from = "f32")]
    bpm: f64,
    length: i32,

    #[sqlx(try_from = "f32")]
    cs: f64,
    #[sqlx(try_from = "f32")]
    ar: f64,
    #[sqlx(try_from = "f32")]
    od: f64,
    #[sqlx(try_from = "f32")]
    hp: f64,
}

#[graphql_object(description = "The stats of some map with a certain mod combination", Context = DataContext)]
impl MapStats {
    /// The mods this selected combination applies to
    pub fn mod_string(&self) -> &str {
        &self.mod_string
    }

    /// Star Rating (how difficult)
    pub fn star_rating(&self) -> f64 {
        self.star_rating
    }

    /// Average BPM of map
    pub fn bpm(&self) -> f64 {
        self.bpm
    }

    /// Length (in seconds) of drain time
    pub fn length(&self) -> i32 {
        self.length
    }

    /// Circle Size
    pub fn cs(&self) -> f64 {
        self.cs
    }

    /// Approach Rate
    pub fn ar(&self) -> f64 {
        self.ar
    }

    /// Overall Difficulty
    pub fn od(&self) -> f64 {
        self.od
    }

    /// HP Drain
    pub fn hp(&self) -> f64 {
        self.hp
    }

    /// The map these stats represent
    pub async fn map(&self, context: &DataContext) -> FieldResult<Map> {
        context
            .acquire()
            .await
            .get_map_by_id(self.map_id)
            .await
            .map_err(FieldError::from)
    }
}
