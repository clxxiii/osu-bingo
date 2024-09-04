import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { OSU_CLIENT_ID } from '$lib/env';
import { createAuthUrl } from '$lib/server/osu';
import { newState } from '../../state';



export const GET: RequestHandler = ({ url }) => {
	let from = url.searchParams.get('from');
	if (!from) from = "/";
	const redirectUrl = createAuthUrl(OSU_CLIENT_ID, `${url.origin}/auth/callback/osu`, [
		'public',
		'identify'
	], newState(from));
	redirect(StatusCodes.TEMPORARY_REDIRECT, redirectUrl);
};
