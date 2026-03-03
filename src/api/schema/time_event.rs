use chrono::{DateTime, Utc};
use juniper::{FieldError, FieldResult, graphql_object};
use serde::{Deserialize, Serialize};

use crate::{database::DataContext, schema::BingoGame};

#[derive(sqlx::FromRow, Deserialize, Serialize)]
pub struct TimeEvent {
    id: String,
    time: DateTime<Utc>,
    action: String,
    fulfilled: bool,

    game_id: String,
}

#[graphql_object(description = "Represents an event that is scheduled to happen at a certain time", Context = DataContext)]
impl TimeEvent {
    fn id(&self) -> &str {
        self.id.as_ref()
    }
    fn time(&self) -> &DateTime<Utc> {
        &self.time
    }
    fn action(&self) -> &str {
        self.action.as_ref()
    }
    fn fulfilled(&self) -> bool {
        self.fulfilled
    }

    /// The game this square is associated with
    pub async fn game(&self, context: &DataContext) -> FieldResult<BingoGame> {
        context
            .acquire()
            .await
            .get_game_by_id(&self.game_id)
            .await
            .map_err(FieldError::from)
    }
}
