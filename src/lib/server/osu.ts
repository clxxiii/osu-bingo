import type { Osu } from '../osu';

const BASE_URL = 'https://osu.ppy.sh/api/v2';
const AUTH_URL = 'https://osu.ppy.sh/oauth/authorize';
const TOKEN_URL = 'https://osu.ppy.sh/oauth/token';

export const createAuthUrl = (
	client_id: string,
	redirect_uri: string,
	scopes: Osu.AuthScope[],
	state?: string
) => {
	const params = new URLSearchParams();
	params.set('client_id', client_id);
	params.set('scope', scopes.join(' '));
	params.set('response_type', 'code');
	params.set('redirect_uri', redirect_uri);
	if (state) {
		params.set('state', state);
	}

	return `${AUTH_URL}?${params.toString()}`;
};

export const exchangeAuthCode = async (
	code: string,
	client_id: string,
	client_secret: string,
	redirect_uri: string
): Promise<Osu.AuthorizationCodeTokenResponse> => {
	const body = {
		client_id,
		client_secret,
		code,
		grant_type: 'authorization_code',
		redirect_uri
	};

	const tokenReqUrl = `${TOKEN_URL}`;
	const tokenReq = await fetch(tokenReqUrl, {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(body)
	});
	return tokenReq.json();
};

export const getMe = async (access_token: string): Promise<Osu.User> => {
	const userReq = await fetch(`${BASE_URL}/me`, {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});
	return userReq.json();
};

// This is a very basic beatmap fetcher
// Something else should be used in the future to increase
// The quality of the maps.
export const getBeatmaps = async (min_sr: number, max_sr: number, access_token: string) => {
	const params = new URLSearchParams();
	params.set('q', `stars>${min_sr} stars<${max_sr}`);

	const beatmapSets = await fetch(`${BASE_URL}/beatmapsets/search?${params.toString()}`, {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});
	const response = await beatmapSets.json();
	const beatmapsets: Osu.Beatmapset[] = response.beatmapsets;

	return beatmapsets;
};

export const refreshOAuthToken = async (token: Bingo.OauthToken,
	client_id: string,
	client_secret: string,
): Promise<Osu.AuthorizationCodeTokenResponse | null> => {
	const refreshBody = {
		client_id,
		client_secret,
		grant_type: 'refresh_token',
		refresh_token: token.refresh_token
	}

	const refreshReq = await fetch(TOKEN_URL, {
		method: 'POST',
		body: JSON.stringify(refreshBody),
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	})

	const updatedToken = await refreshReq.json();

	// Successfully updated
	if (refreshReq.ok && updatedToken.access_token) {
		return updatedToken;
	}
	return null;
}

export const getRecentScores = async (user_id: number, access_token: string) => {
	const scores = await fetch(`${BASE_URL}/users/${user_id}/scores/recent`, {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});
	const response: Osu.Score[] = await scores.json();
	if (scores.ok) {
		return response;
	}
	return null;
}