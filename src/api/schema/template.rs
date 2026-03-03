use juniper::{FieldError, FieldResult, graphql_object};
use serde::{Deserialize, Serialize};

use crate::{database::DataContext, schema::User};

#[derive(sqlx::FromRow, Serialize, Deserialize)]
pub struct Template {
    id: String,
    owner_id: i32,
    name: Option<String>,
    description: Option<String>,
    data: String,
}

#[graphql_object(description = "A reusable options spec you can apply to a game", Context = DataContext)]
impl Template {
    ///
    pub fn id(&self) -> &str {
        &self.id
    }

    /// An optional name for the template
    pub fn name(&self) -> Option<&str> {
        self.name.as_deref()
    }

    /// An optional description of the template
    pub fn description(&self) -> Option<&str> {
        self.description.as_deref()
    }

    /// The template data
    pub fn data(&self) -> &String {
        &self.data
    }

    /// The user that created the template
    pub async fn owner(&self, context: &DataContext) -> FieldResult<User> {
        context
            .acquire()
            .await
            .get_user_by_id(self.owner_id)
            .await
            .map_err(FieldError::from)
    }
}
