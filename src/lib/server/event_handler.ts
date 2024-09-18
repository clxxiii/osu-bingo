/**
 * Processes 'TimeEvents' from the database,
 * scheduled by `polling/gamescheduler.ts`
 */

import { getMeaning as getClaimMeaning } from '$lib/bingo-helpers/claimworthy';
import q from '$lib/drizzle/queries';
import { claimchange } from './game/rulechange';
import { startGame } from './game/start';
import { finalCall } from './game/final_call';

export type EventHandler = {
	display_string: (action: string) => string;
	evaluate: (event: Bingo.TimeEvent) => Promise<void>;
};

const events: { [key: string]: EventHandler } = {
	start: {
		display_string: () => `Start the game`,
		evaluate: async ({ game_id, id }) => {
			await q.setFulfilled(id);
			await startGame(game_id);
		}
	},
	claimchange: {
		display_string: (action) =>
			`Change claim condition: ${getClaimMeaning(action.split('_').slice(1).join('_'))}`,
		evaluate: async ({ game_id, id, action }) => {
			await q.setFulfilled(id);
			const rule = action.split('_').slice(1).join('_');
			await claimchange(game_id, rule);
		}
	},
	finalcall: {
		display_string: () => `Winner will be decided by tiebreaker conditions`,
		evaluate: async ({ game_id, id }) => {
			await q.setFulfilled(id);
			await finalCall(game_id);
		}
	}
};

export const getMeaning = (action: string) => {
	const term = action.split('_')[0];
	const eventHandler = events[term];
	if (!eventHandler) return action;
	return eventHandler.display_string(action);
};

export default events;
