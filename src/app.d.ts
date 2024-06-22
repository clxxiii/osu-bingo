// See https://kit.svelte.dev/docs/types#app

import type {
	BingoGame,
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
	User,
	User
} from '$lib/drizzle/schema';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: typeof User.$inferSelect;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	namespace Bingo {
		type BingoGame = typeof BingoGame.$inferSelect;
		type BingoSquare = typeof BingoSquare.$inferSelect;
		type Chat = typeof Chat.$inferSelect;
		type GameUser = typeof GameUser.$inferSelect;
		type Map = typeof Map.$inferSelect;
		type MapStats = typeof MapStats.$inferSelect;
		type OauthToken = typeof OauthToken.$inferSelect;
		type Score = typeof Score.$inferSelect;
		type Session = typeof Session.$inferSelect;
		type TimeEvent = typeof TimeEvent.$inferSelect;
		type User = typeof User.$inferSelect;

		namespace Card {
			type FullSquare = BingoSquare & {
				data: FullMap;
				claimed_by: GameUser | null;
				scores: FullScore[];
			};
			type FullUser = GameUser & {
				user: User
			}
			type FullMap = Map & {
				stats: MapStats;
			};
			type FullScore = Score & {
				user: FullUser
			}
			type FullChat = Chat & {
				user: FullUser
			}
		}
		type Card = BingoGame & {
			squares: Card.FullSquare[] | null; // Null if game state is 0 (to hide squares)
			events: TimeEvent[];
			users: Card.FullUser[];
		};
	}
}

export { };
