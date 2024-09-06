import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { env } from '$env/dynamic/private';
import { createAuthUrl } from '$lib/server/osu';
import { newState } from '../../state';



export const GET: RequestHandler = ({ url }) => {
	let from = url.searchParams.get('from');
	if (!from) from = "/";
	const redirectUrl = createAuthUrl(env.OSU_CLIENT_ID, `${url.origin}/auth/callback/osu`, [
		'public',
		'identify'
	], newState(from));
	redirect(StatusCodes.TEMPORARY_REDIRECT, redirectUrl);
};
