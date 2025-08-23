import type { Options } from './options';

export const getClaimConditionMeaning = (c: Options.ClaimCondition) => {
	const qLang1 = (q: 'lt' | 'gt' | 'eq') =>
		q == 'gt' ? 'more than' : q == 'eq' ? 'exactly' : 'less than';
	const qLang2 = (q: 'lt' | 'gt' | 'eq') =>
		q == 'gt' ? 'at least' : q == 'eq' ? 'exactly' : 'at most';

	const evaluate: { [key: string]: (c: Options.ClaimCondition) => string } = {
		fc: () => 'Get an FC',
		pass: () => 'Pass the map',
		any: () => 'Get any score',

		rank: (c) => `Get ${qLang2(c.quantifier ?? 'gt')} a ${c.value} rank`,
		score: (c) => `Get ${qLang2(c.quantifier ?? 'gt')} ${parseInt(c.value).toLocaleString()} score`,
		pp: (c) => `Get ${qLang2(c.quantifier ?? 'gt')} ${c.value}pp`,
		miss: (c) => `Get ${qLang2(c.quantifier ?? 'gt')} ${c.value} miss${c.value != 1 ? 'es' : ''}`,
		accuracy: (c) =>
			`Get ${qLang1(c.quantifier ?? 'gt')} ${parseFloat(c.value).toFixed(2)}% accuracy`,
		combo: (c) => `Get ${qLang2(c.quantifier ?? 'gt')} ${c.value} combo`
	};

	return evaluate[c.metric](c);
};

export const getEventMeaning = (c: Options.Event) => {
	const events: { [key: string]: () => string } = {
		start: () => `Start the game`,
		claimchange: () => `Change claim condition: ${getClaimConditionMeaning(c.detail)}`,
		finalcall: () => `Winner will be decided by tiebreaker conditions`
	};

	return events[c.event]();
};
