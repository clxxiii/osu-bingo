use bingolib::rabbit::QueueConsumerInitializer;
use lapin::{
    Channel, Error,
    options::{BasicConsumeOptions, QueueDeclareOptions},
};
mod fetch_user_scores;

pub async fn register_consumers(channel: &Channel) -> Result<(), Error> {
    let helper = QueueConsumerInitializer::new(
        &channel,
        QueueDeclareOptions {
            ..Default::default()
        },
        BasicConsumeOptions {
            exclusive: true,
            ..Default::default()
        },
    );

    let test_queue = helper
        .declare("test_queue".into(), |delivery| async move {
            println!("{delivery:?}");
        })
        .await;

    match test_queue {
        Ok(_) => (),
        Err(err) => {
            log::error!("Failed to build test queue! {err}");
            return Err(err);
        }
    };

    Ok(())
}
