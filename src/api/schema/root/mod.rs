mod mutation;
mod query;

use juniper::{EmptySubscription, RootNode};
pub use query::*;

use crate::database::DataContext;

pub type Schema =
    RootNode<'static, query::Query, mutation::Mutations, EmptySubscription<DataContext>>;

pub fn create_schema() -> Schema {
    Schema::new(query::Query, mutation::Mutations, EmptySubscription::new())
}
