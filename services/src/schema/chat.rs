use chrono::{DateTime, Utc};
use juniper::{FieldError, FieldResult, graphql_object};
use serde::{Deserialize, Serialize};

use crate::{
    database::DataContext,
    schema::{BingoGame, User},
};

#[derive(sqlx::FromRow, Deserialize, Serialize)]
pub struct Chat {
    id: String,

    game_id: String,
    user_id: i32,

    time: DateTime<Utc>,

    text: String,
    channel: String,
}

#[graphql_object(description = "A chat message in a lobby", Context = DataContext)]
impl Chat {
    /// A unique identifier for the chat message
    pub fn id(&self) -> &str {
        &self.id
    }

    /// The time at which the message was sent
    pub fn time(&self) -> &DateTime<Utc> {
        &self.time
    }

    /// The content of the message
    pub fn text(&self) -> &str {
        &self.text
    }

    /// The channel the message was sent in
    pub fn channel(&self) -> &str {
        &self.channel
    }

    /// The game the chat message was sent in
    pub async fn game(&self, context: &DataContext) -> FieldResult<BingoGame> {
        context
            .acquire()
            .await
            .get_game_by_id(&self.game_id)
            .await
            .map_err(FieldError::from)
    }

    /// The user that posted the chat message
    pub async fn user(&self, context: &DataContext) -> FieldResult<User> {
        context
            .acquire()
            .await
            .get_user_by_id(self.user_id)
            .await
            .map_err(FieldError::from)
    }
}
