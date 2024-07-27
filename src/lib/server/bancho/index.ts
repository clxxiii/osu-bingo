import { BANCHO_USER, BANCHO_PASS, BANCHO_KEY } from '$env/static/private'
import pkg from "bancho.js";
import q from "$lib/drizzle/queries"
import { sendBoard } from './bancho_board';
import { logger } from '$lib/logger';
const { BanchoClient } = pkg;

export const client = new BanchoClient({
  'username': BANCHO_USER,
  'password': BANCHO_PASS,
  'apiKey': BANCHO_KEY
})

export const connect = () => {
  if (client.isConnected()) return;

  client.connect().then(() => {
    logger.info('Connected to bancho!')
  })
}

let sending = false;
const queue: { msg: string[], id: number }[] = [];
export const sendMessage = async (msg: string[], id: number) => {
  queue.push({ msg, id })
  if (sending) return;

  sending = true;
  for (const { msg, id } of queue) {
    const user = await client.getUserById(id);
    if (!user) return;
    for (const string of msg) {
      await user.sendMessage(string);
    }
  }
  sending = false;
}

client.on('PM', async ({ user, message }) => {
  if (message !== '!board') return;
  await user.fetchFromAPI();
  const gameCheck = await q.isInGame(user.id);
  if (!gameCheck) return;
  const game = await q.getGame(gameCheck.game_id)
  if (!game) return;
  await sendBoard(user.id, game);
})