import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { Chat, GameUser, User } from '../schema';
import { logger } from '$lib/logger';

export const sendChat = async (
	user_id: number,
	game_id: string,
	text: string,
	channel: string
): Promise<Bingo.Card.FullChat | null> => {
	logger.silly('Started db request', { function: 'sendChat', obj: 'chat', dir: 'start' });
	const chat = (
		await db
			.insert(Chat)
			.values({
				user_id: user_id,
				text,
				channel: channel.toUpperCase(),
				game_id
			})
			.returning()
	)[0];
	logger.silly('Finished db request', { function: 'sendChat', obj: 'chat', dir: 'end' });

	logger.silly('Started db request', { function: 'sendChat', obj: 'user', dir: 'start' });
	const user = (
		await db
			.select()
			.from(User)
			.innerJoin(GameUser, and(eq(GameUser.user_id, User.id), eq(GameUser.game_id, game_id)))
			.where(and(eq(User.id, user_id)))
	)[0];
	logger.silly('Finished db request', { function: 'sendChat', obj: 'user', dir: 'end' });

	return { ...chat, user: { ...user.GameUser, user: user.User } };
};

export const getChatChannel = async (
	game_id: string,
	channel: string
): Promise<Bingo.Card.FullChat[]> => {
	const chats: Bingo.Card.FullChat[] = [];
	logger.silly('Started db request', { function: 'getChatChannel', obj: 'dbChats', dir: 'start' });
	const dbChats = await db
		.select({
			chat: Chat,
			gameuser: GameUser,
			user: User
		})
		.from(Chat)
		.leftJoin(User, eq(Chat.user_id, User.id))
		.leftJoin(GameUser, and(eq(User.id, GameUser.user_id), eq(Chat.game_id, GameUser.game_id)))
		.where(and(
			eq(Chat.game_id, game_id),
			eq(Chat.channel, channel.toUpperCase())))
	logger.silly('Finished db request', { function: 'getChatChannel', obj: 'dbChats', dir: 'end' });

	for (const data of dbChats) {
		if (!data || !data.user || !data.gameuser) continue;
		chats.push({ ...data.chat, user: { ...data.gameuser, user: data.user } });
	}

	return chats;
};
