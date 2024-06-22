import { and, eq } from "drizzle-orm"
import { db, emitter } from ".."
import { Chat, GameUser } from "../schema"
import { getGame } from "./game";

export const sendChat = async (user_id: number, game_id: string, text: string, channel: string) => {
  const gameUser = (await db.select().from(GameUser).where(and(
    eq(GameUser.user_id, user_id),
    eq(GameUser.game_id, game_id)
  )))[0];
  if (!gameUser) return;

  await db.insert(Chat).values({
    game_user_id: gameUser.id,
    text,
    channel,
    game_id
  })

  emitter.emit(game_id, await getGame(game_id));
}