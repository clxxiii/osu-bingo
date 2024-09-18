import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import q from '$lib/drizzle/queries';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) redirect(StatusCodes.TEMPORARY_REDIRECT, `/auth/login/osu?from=/templates/new`);

	const template = await q.newTemplate(locals.user.id);
	if (!template) redirect(StatusCodes.TEMPORARY_REDIRECT, `/templates`);
	redirect(StatusCodes.TEMPORARY_REDIRECT, `/templates/${template.id.slice(4)}`);
};
