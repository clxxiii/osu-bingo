import { relations } from 'drizzle-orm';

import {
	BingoGame,
	BingoSquare,
	Chat,
	GameUser,
	Map,
	MapInPool,
	Mappool,
	MapStats,
	OauthToken,
	Score,
	Session,
	Template,
	TimeEvent,
	User
} from './schema';

export const BingoGameRelations = relations(BingoGame, ({ one, many }) => ({
	users: many(GameUser),
	events: many(TimeEvent),
	squares: many(BingoSquare),
	template: one(Template, { fields: [BingoGame.template_id], references: [Template.id] })
}));

export const BingoSquareRelations = relations(BingoSquare, ({ one, many }) => ({
	scores: many(Score),
	game: one(BingoGame, { fields: [BingoSquare.game_id], references: [BingoGame.id] }),
	map: one(Map, { fields: [BingoSquare.map_id], references: [Map.id] }),
	claimed_by: one(GameUser, { fields: [BingoSquare.claimed_by_id], references: [GameUser.id] })
}));

export const GameUserRelations = relations(GameUser, ({ one }) => ({
	game: one(BingoGame, { fields: [GameUser.game_id], references: [BingoGame.id] }),
	user: one(User, { fields: [GameUser.user_id], references: [User.id] })
}));

export const UserRelations = relations(User, ({ many }) => ({
	game_list: many(GameUser),
	tokens: many(OauthToken),
	sessions: many(Session),
	chats: many(Chat),
	templates: many(Template)
}));

export const TokenRelations = relations(OauthToken, ({ one }) => ({
	user: one(User, { fields: [OauthToken.user_id], references: [User.id] })
}));

export const SessionRelations = relations(Session, ({ one }) => ({
	user: one(User, { fields: [Session.user_id], references: [User.id] })
}));

export const EventRelations = relations(TimeEvent, ({ one }) => ({
	game: one(BingoGame, { fields: [TimeEvent.game_id], references: [BingoGame.id] })
}));

export const MappoolRelations = relations(Mappool, ({ many }) => ({
	maps: many(MapInPool)
}));

export const MapInPoolRelations = relations(MapInPool, ({ one }) => ({
	pool: one(Mappool, { fields: [MapInPool.pool_id], references: [Mappool.id] }),
	map: one(Map, { fields: [MapInPool.map_id], references: [Map.id] })
}));

export const MapRelations = relations(Map, ({ many }) => ({
	in_squares: many(BingoSquare),
	in_pools: many(MapInPool),
	stats: many(MapStats)
}));

export const MapStatsRelations = relations(MapStats, ({ one }) => ({
	map: one(Map, { fields: [MapStats.map_id], references: [Map.id] })
}));

export const ScoreRelations = relations(Score, ({ one }) => ({
	square: one(BingoSquare, { fields: [Score.square_id], references: [BingoSquare.id] }),
	game_user: one(GameUser, {
		fields: [Score.game_user_id],
		references: [GameUser.id]
	})
}));

export const ChatRelations = relations(Chat, ({ one }) => ({
	game: one(BingoSquare, { fields: [Chat.game_id], references: [BingoSquare.id] }),
	user: one(User, { fields: [Chat.user_id], references: [User.id] })
}));

export const TemplateRelations = relations(Template, ({ many, one }) => ({
	games: many(BingoGame),
	owner: one(User, { fields: [Template.owner_id], references: [User.id] })
}));
