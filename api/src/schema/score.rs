use chrono::{DateTime, Utc};
use juniper::{FieldError, FieldResult, graphql_object};
use serde::{Deserialize, Serialize};

use crate::{
    database::DataContext,
    schema::{BingoSquare, Float, GameUser, Long},
};

#[derive(sqlx::FromRow, Serialize, Deserialize)]
pub struct Score {
    id: String,

    score_id: i64,
    user_id: i32,

    date: DateTime<Utc>,
    mods: Option<String>,
    lazer: bool,

    percentage: Option<f32>,
    is_fc: bool,
    score: i32,
    pp: Option<f32>,
    grade: String,
    accuracy: f32,
    max_combo: i32,

    important: bool,
    claim: ClaimAction,

    square_id: String,
    game_user_id: String,
}

#[derive(sqlx::Type, Deserialize, Serialize, juniper::GraphQLEnum)]
#[sqlx(type_name = "claim_action", rename_all = "PascalCase")]
#[serde(rename_all = "PascalCase")]
pub enum ClaimAction {
    NoChange,
    Claim,
    ReClaim,
    Win,
}

#[graphql_object(description = "A user's score on a certain bingo square", Context = DataContext)]
impl Score {
    pub fn id(&self) -> &str {
        &self.id
    }

    /// https://osu.ppy.sh/s/[score_id]
    pub fn score_id(&self) -> Long {
        self.score_id.into()
    }

    /// The osu! id of the user that played the map
    pub fn user_id(&self) -> i32 {
        self.user_id
    }

    /// When the score was set
    pub fn date(&self) -> &DateTime<Utc> {
        &self.date
    }

    /// The mods the user used when playing
    pub fn mods(&self) -> Option<&String> {
        self.mods.as_ref()
    }

    /// Whether or not the user submitted the score on lazer
    pub fn is_lazer(&self) -> bool {
        self.lazer
    }

    /// If you fail, how far through the map you got
    pub fn percentage(&self) -> Option<Float> {
        self.percentage.map(|f| f.into())
    }

    /// Whether or not the user fulll comboed the map
    pub fn is_fc(&self) -> bool {
        self.is_fc
    }

    /// The numerical (standardized) score on the map
    pub fn score(&self) -> i32 {
        self.score
    }

    /// The amount of pp recieved (null if not ranked)
    pub fn pp(&self) -> Option<Float> {
        self.pp.map(|f| f.into())
    }

    /// The letter grade they got on the map
    pub fn grade(&self) -> &str {
        &self.grade
    }

    /// The final accuracy they got on the map
    pub fn accuracy(&self) -> Float {
        self.accuracy.into()
    }

    /// The maximum combo achieved on the map
    pub fn max_combo(&self) -> i32 {
        self.max_combo
    }

    /// Whether or not the score would the conditions to claim the square
    pub fn claimworthy(&self) -> bool {
        self.important
    }

    /// The affect this score had on the result of the game's board
    pub fn claim(&self) -> &ClaimAction {
        &self.claim
    }

    /// The game user that set this score
    pub async fn gameuser(&self, context: &DataContext) -> FieldResult<GameUser> {
        context
            .acquire()
            .await
            .get_gameuser_by_id(&self.game_user_id)
            .await
            .map_err(FieldError::from)
    }

    /// The square this score was a part of
    pub async fn square(&self, context: &DataContext) -> FieldResult<BingoSquare> {
        context
            .acquire()
            .await
            .get_square_by_id(&self.square_id)
            .await
            .map_err(FieldError::from)
    }
}
