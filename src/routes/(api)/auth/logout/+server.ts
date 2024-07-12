import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import q from '$lib/drizzle/queries';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const back = url.searchParams.get('from') ?? '/'
	const token = cookies.get('osu_bingo_token');
	if (!token) {
		redirect(StatusCodes.TEMPORARY_REDIRECT, back);
	}
	await q.deleteSession(token);
	cookies.delete('osu_bingo_token', { path: '/' });
	redirect(StatusCodes.TEMPORARY_REDIRECT, back);
};
