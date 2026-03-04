use futures_lite::StreamExt;
use lapin::{
    Channel,
    message::Delivery,
    options::{BasicAckOptions, BasicConsumeOptions, QueueDeclareOptions},
    types::FieldTable,
};
use tokio::sync::Mutex;

/// A helper struct to declare and initialize queues and consumers
pub struct QueueConsumerInitializer<'a> {
    channel: &'a Channel,
    queue_declare_options: QueueDeclareOptions,
    basic_consume_options: BasicConsumeOptions,
}

impl<'a> QueueConsumerInitializer<'a> {
    pub fn new(
        channel: &'a Channel,
        queue_declare_options: QueueDeclareOptions,
        basic_consume_options: BasicConsumeOptions,
    ) -> Self {
        QueueConsumerInitializer {
            channel,
            queue_declare_options,
            basic_consume_options,
        }
    }

    pub async fn declare<F, Fut>(&self, queue_name: String, cb: F) -> Result<(), lapin::Error>
    where
        F: Fn(Delivery) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = ()> + Send + 'static,
    {
        let queue = match self
            .channel
            .queue_declare(
                queue_name.clone().into(),
                self.queue_declare_options.clone(),
                FieldTable::default(),
            )
            .await
        {
            Ok(x) => x,
            Err(err) => {
                log::error!("Failed to declare queue {queue_name}: {err}");
                return Err(err);
            }
        };

        let mut consumer = match self
            .channel
            .basic_consume(
                queue.name().clone(),
                "".into(),
                self.basic_consume_options.clone(),
                FieldTable::default(),
            )
            .await
        {
            Ok(x) => x,
            Err(err) => {
                log::error!("Failed to declare consumer: {err}");
                return Err(err);
            }
        };

        log::info!("Initializing consumer for queue {}", queue.name());

        // Spawn task to continuously consume messages
        tokio::task::spawn(async move {
            while let Some(delivery) = consumer.next().await {
                let delivery = match delivery {
                    Ok(x) => x,
                    Err(err) => {
                        log::warn!("Recieved delivery had an error: {err}");
                        continue;
                    }
                };

                // Ack Delivery
                match delivery.ack(BasicAckOptions::default()).await {
                    Ok(_) => (),
                    Err(err) => {
                        log::warn!("Failed to send ack: {err}");
                    }
                }

                // Run provided callback on data
                cb(delivery).await;
            }
        });

        Ok(())
    }
}
