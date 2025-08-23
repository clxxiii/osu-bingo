use juniper::{FieldError, FieldResult, graphql_object};
use serde::{Deserialize, Serialize};

use crate::{
    database::DataContext,
    schema::{Map, Mappool},
};

#[derive(sqlx::FromRow, Deserialize, Serialize)]
pub struct MapInPool {
    id: String,
    pool_id: String,
    map_id: i32,

    required_mods: Option<String>,
}

#[graphql_object(description = "Represents a map being a part of some mappool", Context = DataContext)]
impl MapInPool {
    /// A unique identifier for mapinpool objects
    fn id(&self) -> &str {
        self.id.as_ref()
    }

    /// Mods that are forced
    fn required_mods(&self) -> Option<&String> {
        self.required_mods.as_ref()
    }

    /// The map associated
    pub async fn map(&self, context: &DataContext) -> FieldResult<Map> {
        context
            .acquire()
            .await
            .get_map_by_id(self.map_id)
            .await
            .map_err(FieldError::from)
    }

    /// The pool associated
    pub async fn pool(&self, context: &DataContext) -> FieldResult<Mappool> {
        context
            .acquire()
            .await
            .get_mappool_by_id(&self.pool_id)
            .await
            .map_err(FieldError::from)
    }
}
