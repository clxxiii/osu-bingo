use chrono::{DateTime, Utc};
use juniper::{FieldError, FieldResult, graphql_object};
use serde::{Deserialize, Serialize};

use crate::{
    database::DataContext,
    schema::{Chat, Float, GameUser, Long, Template},
};

#[derive(sqlx::FromRow, Deserialize, Serialize)]
pub struct User {
    id: i32,

    username: String,
    country_code: String,
    country_name: String,

    cover_url: String,
    avatar_url: String,

    pp: f32,
    global_rank: Option<i32>,
    country_rank: Option<i32>,

    total_score: Option<i64>,
    ranked_score: Option<i64>,
    hit_accuracy: Option<f32>,
    play_count: Option<i32>,
    level: Option<i32>,
    level_progress: Option<i32>,

    last_refreshed: DateTime<Utc>,
}

#[graphql_object(description = "Represents an osu! user (and a bingo user)", Context = DataContext)]
impl User {
    pub fn id(&self) -> i32 {
        self.id
    }

    /// Matches the user's osu! username
    pub fn username(&self) -> &str {
        &self.username
    }

    /// The country they are from (US, GE, CA)
    pub fn country_code(&self) -> &str {
        &self.country_code
    }

    /// The country they are from (United States, Germany, Canada)
    pub fn country_name(&self) -> &str {
        &self.country_name
    }

    /// The url for their profile banner
    pub fn cover_url(&self) -> &str {
        &self.cover_url
    }

    /// The url for their profile picture
    pub fn avatar_url(&self) -> &str {
        &self.avatar_url
    }

    pub fn pp(&self) -> Float {
        self.pp.into()
    }

    pub fn global_rank(&self) -> Option<i32> {
        self.global_rank
    }

    pub fn country_rank(&self) -> Option<i32> {
        self.country_rank
    }

    pub fn total_score(&self) -> Option<Long> {
        self.total_score.map(|x| x.into())
    }

    pub fn ranked_score(&self) -> Option<Long> {
        self.ranked_score.map(|x| x.into())
    }

    pub fn hit_accuracy(&self) -> Option<Float> {
        self.hit_accuracy.map(|x| x.into())
    }

    pub fn play_count(&self) -> Option<i32> {
        self.play_count
    }

    pub fn level(&self) -> Option<i32> {
        self.level
    }

    pub fn level_progress(&self) -> Option<i32> {
        self.level_progress
    }

    pub fn last_refreshed(&self) -> &DateTime<Utc> {
        &self.last_refreshed
    }

    pub async fn in_games(&self, context: &DataContext) -> FieldResult<Vec<GameUser>> {
        context
            .acquire()
            .await
            .get_user_gameusers(self.id)
            .await
            .map_err(FieldError::from)
    }

    pub async fn chats(&self, context: &DataContext) -> FieldResult<Vec<Chat>> {
        context
            .acquire()
            .await
            .get_user_chats(self.id)
            .await
            .map_err(FieldError::from)
    }

    pub async fn templates(&self, context: &DataContext) -> FieldResult<Vec<Template>> {
        context
            .acquire()
            .await
            .get_user_templates(self.id)
            .await
            .map_err(FieldError::from)
    }
}
