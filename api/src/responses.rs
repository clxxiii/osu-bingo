use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;

#[derive(Serialize)]
pub struct ApiError {
    code: u16,
    message: String,
}

impl ApiError {
    pub fn new(code: u16, msg: &str) -> Self {
        ApiError {
            code,
            message: String::from(msg),
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let body = (
            StatusCode::from_u16(self.code).unwrap(),
            serde_json::to_string(&self).unwrap(),
        )
            .into_response()
            .into_body();

        Response::builder()
            .header("Content-Type", "application/json")
            .status(self.code)
            .body(body)
            .unwrap()
    }
}

impl From<sqlx::Error> for ApiError {
    fn from(value: sqlx::Error) -> Self {
        match value {
            sqlx::Error::RowNotFound => ApiError::new(404, "Requested item yielded no results"),
            x => ApiError::new(500, x.to_string().as_str()),
        }
    }
}

impl From<&str> for ApiError {
    fn from(value: &str) -> Self {
        ApiError::new(500, value)
    }
}

impl From<(u16, &str)> for ApiError {
    fn from(value: (u16, &str)) -> Self {
        ApiError::new(value.0, value.1)
    }
}

impl From<u16> for ApiError {
    fn from(value: u16) -> Self {
        let phrase = StatusCode::from_u16(value)
            .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR)
            .canonical_reason()
            .unwrap_or("Unknown Reason");

        (value, phrase).into()
    }
}
