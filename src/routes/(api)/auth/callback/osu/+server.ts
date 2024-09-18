import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { env } from '$env/dynamic/private';
import q from '$lib/drizzle/queries';
import { exchangeAuthCode, getMe } from '$lib/server/osu';
import { getState } from '../../state';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const stateId = url.searchParams.get('state');
	if (code == null || stateId == null) {
		redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
	}
	const state = getState(stateId);
	if (!state) {
		redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
	}

	const token = await exchangeAuthCode(
		code,
		env.OSU_CLIENT_ID,
		env.OSU_CLIENT_SECRET,
		`${url.origin}/auth/callback/osu`
	);
	const user = await getMe(token.access_token);
	await q.setUser({
		id: user.id,

		username: user.username,
		country_code: user.country_code,
		country_name: user.country?.name ?? user.country_code,

		cover_url: user.cover?.url ?? '',
		avatar_url: user.avatar_url,

		pp: user?.statistics?.pp,

		global_rank: user?.statistics?.global_rank,
		country_rank: user?.statistics?.country_rank,

		total_score: user?.statistics?.total_score,
		ranked_score: user?.statistics?.ranked_score,
		hit_accuracy: user?.statistics?.hit_accuracy,
		play_count: user?.statistics?.play_count,
		level: user?.statistics?.level?.current,
		level_progress: user?.statistics?.level?.progress
	});

	await q.setToken({
		user_id: user.id,
		service: 'osu',
		expires_at: new Date(Date.now() + token.expires_in * 1000),
		...token
	});

	const session = await q.createSession(user.id);
	if (session != null)
		cookies.set('osu_bingo_token', session.token, {
			path: '/',
			expires: new Date(Date.now() + 60 * 60 * 24 * 1000)
		});

	redirect(StatusCodes.TEMPORARY_REDIRECT, state.from);
};
