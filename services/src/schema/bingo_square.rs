use juniper::{FieldError, FieldResult, graphql_object};
use serde::{Deserialize, Serialize};

use crate::{
    database::DataContext,
    schema::{BingoGame, GameUser, Map, Score, Short},
};

#[derive(sqlx::FromRow, Deserialize, Serialize)]
pub struct BingoSquare {
    id: String,

    game_id: String,
    map_id: i32,

    mod_string: String,

    x_pos: i16,
    y_pos: i16,

    claimed_by_id: Option<String>,
}

#[graphql_object(description = "One of the squares on a bingo board", Context = DataContext)]
impl BingoSquare {
    /// A unique identifier for the square
    pub fn id(&self) -> &str {
        &self.id
    }

    /// Mod restrictions for claiming this square
    pub fn mod_string(&self) -> &str {
        &self.mod_string
    }

    /// The square's X position on the board
    pub fn x_pos(&self) -> Short {
        self.x_pos.into()
    }

    /// The square's Y position on the board
    pub fn y_pos(&self) -> Short {
        self.y_pos.into()
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

    /// All of the scores set on this square
    pub async fn scores(&self, context: &DataContext) -> Vec<Score> {
        context
            .acquire()
            .await
            .get_square_scores(&self.id)
            .await
            .map_err(|x| eprintln!("{x}"))
            .unwrap_or(vec![])
    }

    /// The map associated with this square
    pub async fn map(&self, context: &DataContext) -> FieldResult<Map> {
        context
            .acquire()
            .await
            .get_map_by_id(self.map_id)
            .await
            .map_err(FieldError::from)
    }

    /// The game user that claimed this square, if there is one
    pub async fn claimed_by(&self, context: &DataContext) -> Option<GameUser> {
        if let Some(x) = self.claimed_by_id.as_ref() {
            context
                .acquire()
                .await
                .get_gameuser_by_id(&x)
                .await
                .map_err(|x| eprintln!("{x}"))
                .ok()
        } else {
            None
        }
    }
}
