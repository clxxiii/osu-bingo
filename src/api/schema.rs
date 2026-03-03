mod bingo_game;
mod bingo_square;
mod chat;
mod game_user;
mod map;
mod map_in_pool;
mod map_stats;
mod mappool;
mod scalars;
mod score;
mod template;
mod time_event;
mod user;

pub use bingo_game::*;
pub use bingo_square::*;
pub use chat::*;
pub use game_user::*;
pub use map::*;
pub use map_in_pool::*;
pub use map_stats::*;
pub use mappool::*;
pub use scalars::*;
pub use score::*;
pub use template::*;
pub use time_event::*;
pub use user::*;

mod root;
pub use root::*;

use sqlx::PgPool;

#[derive(Clone)]
pub struct Context {
    pub pool: PgPool,
}
