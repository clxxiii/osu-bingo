use juniper::{FieldResult, graphql_object};

use crate::database::DataContext;

pub struct Mutations;

#[graphql_object(Context = DataContext)]
impl Mutations {
    /// Greets the user
    fn hello() -> FieldResult<String> {
        Ok(String::from("Hello!"))
    }
}
