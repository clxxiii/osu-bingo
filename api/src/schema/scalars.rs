use juniper::{
    InputValue, ParseScalarResult, ParseScalarValue, ScalarToken, ScalarValue, graphql_scalar,
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[graphql_scalar(
    name = "Short",
    description = "A 16 bit signed int for small counter applications (square X and Y positions)"
)]
pub struct Short(i16);

impl Short {
    fn to_output<S: ScalarValue>(&self) -> juniper::Value<S> {
        juniper::Value::scalar(self.0 as i32)
    }

    fn from_input<S>(v: &InputValue<S>) -> Result<Self, String>
    where
        S: ScalarValue,
    {
        v.as_int_value()
            .ok_or_else(|| format!("Expected `Int`, found: {v}"))
            .and_then(|v| {
                i16::try_from(v)
                    .map(Self)
                    .map_err(|_| format!("Value {v} is out of range for 16"))
            })
    }

    fn parse_token<S>(value: ScalarToken<'_>) -> ParseScalarResult<S>
    where
        S: ScalarValue,
    {
        <i32 as ParseScalarValue<S>>::from_str(value)
    }
}

impl From<i16> for Short {
    fn from(value: i16) -> Self {
        Short(value)
    }
}

#[derive(Serialize, Deserialize)]
#[graphql_scalar(
    name = "Long",
    description = "A 64 bit signed int for big numbers (score IDs, total score, etc.)"
)]
pub struct Long(i64);

impl Long {
    fn to_output<S: ScalarValue>(&self) -> juniper::Value<S> {
        juniper::Value::scalar(self.0.to_string())
    }

    fn from_input<S>(v: &InputValue<S>) -> Result<Self, String>
    where
        S: ScalarValue,
    {
        v.as_string_value()
            .ok_or_else(|| format!("Expected `String`, found: {v}"))
            .and_then(|v| {
                v.parse::<i64>()
                    .map(Self)
                    .map_err(|_| format!("Value {v} is out of range for 16"))
            })
    }

    fn parse_token<S>(value: ScalarToken<'_>) -> ParseScalarResult<S>
    where
        S: ScalarValue,
    {
        <String as ParseScalarValue<S>>::from_str(value)
    }
}

impl From<i64> for Long {
    fn from(value: i64) -> Self {
        Long(value)
    }
}

#[derive(Serialize, Deserialize)]
#[graphql_scalar(
    name = "Float",
    description = "A 32 bit float for decimals (score IDs, total score, etc.)"
)]
pub struct Float(f32);

impl Float {
    fn to_output<S: ScalarValue>(&self) -> juniper::Value<S> {
        juniper::Value::scalar(self.0 as f64)
    }

    fn from_input<S>(v: &InputValue<S>) -> Result<Self, String>
    where
        S: ScalarValue,
    {
        v.as_float_value()
            .ok_or_else(|| format!("Expected `f64`, found: {v}"))
            .map(|v| Self(v as f32))
    }

    fn parse_token<S>(value: ScalarToken<'_>) -> ParseScalarResult<S>
    where
        S: ScalarValue,
    {
        <f64 as ParseScalarValue<S>>::from_str(value)
    }
}

impl From<f32> for Float {
    fn from(value: f32) -> Self {
        Float(value)
    }
}
