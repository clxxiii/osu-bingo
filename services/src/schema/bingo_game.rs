use chrono::{DateTime, Utc};
use juniper::graphql_object;
use serde::{Deserialize, Serialize};

use crate::{
    database::DataContext,
    schema::{BingoSquare, GameUser, Template},
};

#[derive(sqlx::FromRow, Deserialize, Serialize)]
pub struct BingoGame {
    id: String,
    name: Option<String>,
    winning_team: Option<String>,
    link_id: Option<String>,
    start_time: Option<DateTime<Utc>>,
    end_time: Option<DateTime<Utc>>,
    state: GameState,
    public: bool,
    allow_team_switching: bool,
    options: String,
    template_id: Option<String>,
}

#[derive(sqlx::Type, Deserialize, Serialize, juniper::GraphQLEnum)]
#[sqlx(type_name = "game_state", rename_all = "PascalCase")]
#[serde(rename_all = "PascalCase")]
pub enum GameState {
    BeforeStarting,
    InGame,
    FinalShowdown,
    Finished,
}

#[graphql_object(description = "Represents a game of Bingo", Context = DataContext)]
impl BingoGame {
    /// A unique identifier for the game
    pub fn id(&self) -> &str {
        &self.id
    }

    /// The name for this game
    pub fn name(&self) -> Option<&str> {
        self.name.as_deref()
    }

    /// The name of the team that won this game
    pub fn winning_team(&self) -> Option<&str> {
        self.winning_team.as_deref()
    }

    /// Four letters, similar to a Jackbox invite code
    pub fn link_id(&self) -> Option<&str> {
        self.link_id.as_deref()
    }

    /// The time the game started
    pub fn start_time(&self) -> Option<&DateTime<Utc>> {
        self.start_time.as_ref()
    }

    /// The time the game ended
    pub fn end_time(&self) -> Option<&DateTime<Utc>> {
        self.end_time.as_ref()
    }

    /// What stage the game is currently in
    pub fn state(&self) -> &GameState {
        &self.state
    }

    /// Whether or not the game is listed publicly, and can be publicly joined
    pub fn is_public(&self) -> bool {
        self.public
    }

    /// Whether or not users are allowed to switch their own teams
    pub fn allow_team_switching(&self) -> bool {
        self.allow_team_switching
    }

    /// Game settings specific to this game
    pub fn options(&self) -> &String {
        &self.options
    }

    /// The squares on the board in this game
    pub async fn squares(&self, context: &DataContext) -> Vec<BingoSquare> {
        context
            .acquire()
            .await
            .get_game_squares(&self.id)
            .await
            .map_err(|x| log::error!("{x}"))
            .unwrap_or(vec![])
    }

    /// The users (and teams) of all the users in the game
    pub async fn users(&self, context: &DataContext) -> Vec<GameUser> {
        context
            .acquire()
            .await
            .get_game_users(&self.id)
            .await
            .map_err(|x| log::error!("{x}"))
            .unwrap_or(vec![])
    }

    /// Get the associated template, if it exists
    pub async fn template(&self, context: &DataContext) -> Option<Template> {
        if let Some(template_id) = self.template_id.as_ref() {
            context
                .acquire()
                .await
                .get_template_from_id(&template_id)
                .await
                .map_err(|x| log::error!("{x}"))
                .ok()
        } else {
            None
        }
    }
}
