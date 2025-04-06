/**
 * Processes 'TimeEvents' from the database,
 * scheduled by `polling/gamescheduler.ts`
 */

import q from '$lib/drizzle/queries';
import { claimchange } from './game/rulechange';
import { startGame } from './game/start';
import { finalCall } from './game/final_call';

export type EventHandler = {
	evaluate: (event: Bingo.TimeEvent) => Promise<void>;
};

const events: { [key: string]: EventHandler } = {
	start: {
		evaluate: async ({ game_id, id }) => {
			await q.setFulfilled(id);
			await startGame(game_id);
		}
	},
	claimchange: {
		evaluate: async ({ game_id, id, action }) => {
			await q.setFulfilled(id);
			const rule = action.split('_').slice(1).join('_');
			await claimchange(game_id, rule);
		}
	},
	finalcall: {
		evaluate: async ({ game_id, id }) => {
			await q.setFulfilled(id);
			await finalCall(game_id);
		}
	}
};

export default events;
