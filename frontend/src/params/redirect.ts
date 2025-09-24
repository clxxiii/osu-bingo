import type { ParamMatcher } from '@sveltejs/kit';
import redirects from "$lib/redirects.json"

export const match: ParamMatcher = (param: string) => {
	const paths = redirects.map(x => x.path);
	return paths.includes(param);
};
