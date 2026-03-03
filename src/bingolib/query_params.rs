use std::{
    collections::HashMap,
    fmt::Display,
    ops::{Deref, DerefMut},
};

pub struct QueryParams<'a> {
    map: HashMap<&'a str, &'a str>,
}

impl QueryParams<'_> {
    pub fn new() -> Self {
        QueryParams {
            map: HashMap::new(),
        }
    }
}

impl Display for QueryParams<'_> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut output = String::new();
        for (k, v) in self.iter() {
            match output.len() {
                0 => output.push_str(format!("{k}={v}").as_str()),
                _ => output.push_str(format!("&{k}={v}").as_str()),
            }
        }

        write!(f, "{output}")
    }
}

impl<'a> Deref for QueryParams<'a> {
    type Target = HashMap<&'a str, &'a str>;

    fn deref(&self) -> &Self::Target {
        &self.map
    }
}

impl DerefMut for QueryParams<'_> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.map
    }
}
