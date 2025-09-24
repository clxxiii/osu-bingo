use juniper::{FieldError, FieldResult, graphql_object};
use serde::{Deserialize, Serialize};

use crate::{database::DataContext, schema::MapInPool};

#[derive(sqlx::FromRow, Deserialize, Serialize)]
pub struct Mappool {
    id: String,
    name: String,
}

#[graphql_object(description = "Represents multiple maps that come from a similar source (popular maps, random, tech maps, etc.)", Context = DataContext)]
impl Mappool {
    fn id(&self) -> &str {
        self.id.as_ref()
    }

    fn name(&self) -> &str {
        self.name.as_str()
    }

    pub async fn maps(&self, context: &DataContext) -> FieldResult<Vec<MapInPool>> {
        context
            .acquire()
            .await
            .get_maps_in_mappool(&self.id)
            .await
            .map_err(FieldError::from)
    }
}
