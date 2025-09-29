use rand::{distr::Alphanumeric, Rng};

const ID_LENGTH: usize = 12;

pub fn generate(prefix: &str) -> String {
    let bytes: String = rand::rng()
        .sample_iter(&Alphanumeric)
        .take(ID_LENGTH)
        .map(char::from)
        .collect();

    format!("{prefix}_{bytes}")
}
