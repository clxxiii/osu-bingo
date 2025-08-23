use std::sync::Arc;

use axum::{Extension, Router, routing::get};
use juniper_axum::{extract::JuniperRequest, graphiql, response::JuniperResponse};

use crate::{
    database::{DataContext, pool},
    schema,
};

async fn sdl(Extension(schema): Extension<Arc<schema::Schema>>) -> axum::response::Response {
    axum::response::Response::new(schema.as_sdl().into())
}

async fn handle_graphql(
    Extension(schema): Extension<Arc<schema::Schema>>,
    Extension(context): Extension<schema::Context>,
    JuniperRequest(request): JuniperRequest,
) -> JuniperResponse {
    let loader = DataContext::new(context.pool.clone());
    JuniperResponse(request.execute(&*schema, &loader).await)
}

pub async fn router() -> Router {
    let state = schema::Context { pool: pool().await };

    Router::new()
        .route("/schema", get(sdl))
        .route("/graphql", get(handle_graphql).post(handle_graphql))
        .route("/", get(graphiql("/graphql", "/subscriptions")))
        .layer(Extension(Arc::new(schema::create_schema())))
        .layer(Extension(state))
}
