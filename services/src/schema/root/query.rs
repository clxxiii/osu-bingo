use juniper::{FieldError, FieldResult, graphql_object};

use crate::{database::DataContext, schema::BingoGame};

pub struct Query;
#[graphql_object(Context = DataContext)]
impl Query {
    /// Greets the user
    fn hello() -> FieldResult<String> {
        Ok(String::from("Hello!"))
    }

    /// Get a list of the most recently created games marked as public
    async fn get_public_games(context: &DataContext) -> FieldResult<Vec<BingoGame>> {
        context
            .acquire()
            .await
            .get_public_games()
            .await
            .map_err(FieldError::from)
    }

    /// Get a game using it's id
    async fn get_game_by_id(context: &DataContext, id: String) -> FieldResult<BingoGame> {
        context
            .acquire()
            .await
            .get_game_by_id(&id)
            .await
            .map_err(FieldError::from)
    }
}
