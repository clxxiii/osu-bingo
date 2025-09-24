import type { PageServerLoad } from './$types';
import q from '$lib/drizzle/queries';
import { StatusCodes } from '$lib/StatusCodes';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	const template = await q.getTemplate(`tmt_${params.id}`);
	if (!template) error(StatusCodes.NOT_FOUND);
	if (template.owner_id == locals.user?.id) {
		return { template, owner: true };
	}
	return { template, owner: false };
};
