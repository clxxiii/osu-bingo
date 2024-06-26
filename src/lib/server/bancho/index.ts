import { BANCHO_USER, BANCHO_PASS, BANCHO_KEY } from '$env/static/private'
import pkg from "bancho.js";
const { BanchoClient } = pkg;

export const client = new BanchoClient({
  'username': BANCHO_USER,
  'password': BANCHO_PASS,
  'apiKey': BANCHO_KEY
})

client.connect().then(() => {
  console.log('Connected to bancho!')
})

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
