import {relations} from 'drizzle-orm';

import {
  BingoGame,
  BingoSquare,
  Chat,
  GameUser,
  Map,
  MapStats,
  OauthToken,
  Score,
  Session,
  TimeEvent,
  User
} from './schema';

export const BingoGameRelations =
    relations(BingoGame, ({many}) => ({
                           users : many(GameUser),
                           events : many(TimeEvent),
                           squares : many(BingoSquare)
                         }));

export const BingoSquareRelations = relations(
    BingoSquare,
    ({one, many}) => ({
      scores : many(Score),
      game : one(
          BingoGame,
          {fields : [ BingoSquare.game_id ], references : [ BingoGame.id ]}),
      map : one(Map, {fields : [ BingoSquare.map_id ], references : [ Map.id ]})
    }));

export const GameUserRelations = relations(
    GameUser,
    ({one}) => ({
      game :
          one(BingoGame,
              {fields : [ GameUser.game_id ], references : [ BingoGame.id ]}),
      user :
          one(User, {fields : [ GameUser.user_id ], references : [ User.id ]})
    }));

export const UserRelations = relations(User, ({many}) => ({
                                               game_list : many(GameUser),
                                               tokens : many(OauthToken),
                                               sessions : many(Session)
                                             }));

export const TokenRelations = relations(
    OauthToken,
    ({one}) => ({
      user :
          one(User, {fields : [ OauthToken.user_id ], references : [ User.id ]})
    }));

export const SessionRelations = relations(
    Session,
    ({one}) => ({
      user : one(User, {fields : [ Session.user_id ], references : [ User.id ]})
    }));

export const EventRelations = relations(
    TimeEvent,
    ({one}) => ({
      game :
          one(BingoGame,
              {fields : [ TimeEvent.game_id ], references : [ BingoGame.id ]})
    }));

export const MapRelations = relations(
    Map,
    ({many}) => ({in_squares : many(BingoSquare), stats : many(MapStats)}));

export const MapStatsRelations = relations(
    MapStats,
    ({one}) => ({
      map : one(Map, {fields : [ MapStats.map_id ], references : [ Map.id ]})
    }));

export const ScoreRelations = relations(
    Score,
    ({one}) => ({
      square :
          one(BingoSquare,
              {fields : [ Score.square_id ], references : [ BingoSquare.id ]}),
      game_user : one(GameUser, {
        fields : [ Score.user_id, Score.game_id ],
        references : [ GameUser.user_id, GameUser.game_id ]
      })
    }));

export const ChatRelations = relations(
    Chat,
    ({one}) => ({
      game : one(BingoSquare,
                 {fields : [ Chat.game_id ], references : [ BingoSquare.id ]}),
      user : one(User, {fields : [ Chat.user_id ], references : [ User.id ]})
    }));
