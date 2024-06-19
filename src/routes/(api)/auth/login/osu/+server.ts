import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { PUBLIC_OSU_CLIENT_ID } from '$env/static/public';
import { createAuthUrl } from '$lib/server/osu';

export const GET: RequestHandler = ({ url }) => {
	const redirectUrl = createAuthUrl(PUBLIC_OSU_CLIENT_ID, `${url.origin}/auth/callback/osu`, [
		'public',
		'identify'
	]);
	redirect(StatusCodes.TEMPORARY_REDIRECT, redirectUrl);
};
