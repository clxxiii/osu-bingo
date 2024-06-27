import { and, eq } from "drizzle-orm"
import { db } from ".."
import { Chat, GameUser, User } from "../schema"

export const sendChat = async (user_id: number, game_id: string, text: string, channel: string): Promise<Bingo.Card.FullChat | null> => {
  const chat = (await db.insert(Chat).values({
    user_id: user_id,
    text,
    channel: channel.toUpperCase(),
    game_id
  }).returning())[0]

  const user = (await db.select()
    .from(User)
    .innerJoin(GameUser, and(
      eq(GameUser.user_id, User.id),
      eq(GameUser.game_id, game_id)
    ))
    .where(and(eq(User.id, user_id)))
  )[0]
  return { ...chat, user: { ...user.GameUser, user: user.User } }
}

export const getChatChannel = async (game_id: string, channel: string): Promise<Bingo.Card.FullChat[]> => {
  const chats: Bingo.Card.FullChat[] = []
  const dbChats = await db
    .select()
    .from(Chat)
    .where(and(eq(Chat.game_id, game_id), eq(Chat.channel, channel.toUpperCase())));
  for (const chat of dbChats) {
    const userObj = (await db
      .select()
      .from(GameUser)
      .innerJoin(User, eq(GameUser.user_id, User.id))
      .where(eq(User.id, chat.user_id)
      ))[0]

    chats.push({ ...chat, user: { ...userObj.GameUser, user: userObj.User } })
  }

  return chats;
}