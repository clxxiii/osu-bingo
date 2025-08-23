use juniper::{FieldError, FieldResult, graphql_object};
use serde::{Deserialize, Serialize};

use crate::{
    database::DataContext,
    schema::{BingoGame, User},
};

#[derive(sqlx::FromRow, Deserialize, Serialize)]
pub struct GameUser {
    id: String,

    game_id: String,
    user_id: i32,

    team_name: String,
    host: bool,
}

#[graphql_object(description = "Represents a user's role in a game", Context = DataContext)]
impl GameUser {
    /// A unique identifer for the gameusers
    pub fn id(&self) -> &str {
        &self.id
    }

    /// The name of the team this user is on
    pub fn team_name(&self) -> &str {
        &self.team_name.trim()
    }

    /// Whether or not this user is a host of the game
    pub fn is_host(&self) -> bool {
        self.host
    }

    /// The game this user is a member of
    pub async fn game(&self, context: &DataContext) -> FieldResult<BingoGame> {
        context
            .acquire()
            .await
            .get_game_by_id(&self.game_id)
            .await
            .map_err(FieldError::from)
    }

    /// The user associated with this gameuser
    pub async fn user(&self, context: &DataContext) -> FieldResult<User> {
        context
            .acquire()
            .await
            .get_user_by_id(self.user_id)
            .await
            .map_err(FieldError::from)
    }
}
