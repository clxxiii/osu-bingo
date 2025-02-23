import amqp, { type Channel } from "amqplib";
import { env } from '$env/dynamic/private';
import { logger } from "$lib/logger";
import type { EmitterEvent } from "$lib/emitter";
import { sendToChannel, sendToGame, sendToUser } from "$lib/emitter/server";

type RabbitEvent = {
  send_to: 'user' | 'game' | 'channel',
  topic: string,
  event: EmitterEvent
}

const URL = env.RABBITMQ_URL ?? "amqp://localhost";
const exchange = "osu_bingo_events"

let channel: Channel | null = null
let q_id: string | null = null

export const connect = async () => {
  amqp.connect(URL).then(async (connection) => {

    channel = await connection.createChannel();

    await channel.assertExchange(exchange, "fanout", { durable: false })

    const q = await channel.assertQueue("", { exclusive: true });
    q_id = q.queue;
    await channel.bindQueue(q_id, exchange, '');

    channel.consume(q_id, (msg) => {
      if (!msg) return;


      try {
        const data: RabbitEvent & { q_id: string } = JSON.parse(msg.content.toString())
        if (data.q_id == q_id) return;

        if (data.send_to == "user") {
          sendToUser(parseInt(data.topic), data.event, true);
        } else if (data.send_to == "game") {
          sendToGame(data.topic, data.event, true);
        } else if (data.send_to == "channel") {
          const [game, channel] = data.topic.split("_");
          sendToChannel(game, channel, data.event, true);
        }
      } catch (error) {
        logger.error("Failed to parse event data from RabbitMQ", { type: "rabbit_parse_error", e: error })
      }
    })

    logger.info("Connected to RabbitMQ!", { type: "rabbitmq_connect_success" });
  }).catch((error) => {
    logger.warn("RabbitMQ failed to connect! Users connected to this instance will not communicate with other instances!", { type: "rabbitmq_connect_fail", error })
  })
}

export const publishEvent = (data: RabbitEvent) => {
  if (!channel || !q_id) return;
  channel.publish(exchange, '', Buffer.from(JSON.stringify({ ...data, q_id })));
}