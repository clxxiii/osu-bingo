/**
 * Finds tokens that will expire soon and refreshes them
 */

import { getMe, refreshOAuthToken } from "../osu";
import q from "$lib/drizzle/queries";
import { PUBLIC_OSU_CLIENT_ID } from "$env/static/public";
import { OSU_CLIENT_SECRET } from "$env/static/private";
import { logger } from "$lib/logger";

const POLLING_INTERVAL_MS = 60 * 1000;

let timeout: Timer
export const setup = () => {
  clearTimeout(timeout)
  timeout = setTimeout(async () => {
    await interval();
    setup();
  }, POLLING_INTERVAL_MS)
}

const interval = async () => {
  const lingeringTokens = await q.getLingeringTokens();

  for (const old of lingeringTokens) {
    // Rate limit (make 1 request per second)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const token = await refreshOAuthToken(old, PUBLIC_OSU_CLIENT_ID, OSU_CLIENT_SECRET);

    if (token == null) {
      logger.info(`Failed to update token, deleting...`)
      q.deleteToken(old.id);
      continue;
    }

    // Replace token in database
    q.setToken({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: new Date(Date.now() + token.expires_in * 1000),
      service: 'osu',
      token_type: token.token_type,
      user_id: old.user_id
    })

    // Update user data
    const user = await getMe(token.access_token);

    if (user.statistics)
      await q.setUser({
        id: user.id,

        username: user.username,
        country_code: user.country_code,
        country_name: user.country?.name ?? user.country_code,

        cover_url: user.cover?.url ?? '',
        avatar_url: user.avatar_url,

        pp: user.statistics.pp,

        global_rank: user.statistics.global_rank,
        country_rank: user.statistics.country_rank,

        total_score: user.statistics.total_score,
        ranked_score: user.statistics.ranked_score,
        hit_accuracy: user.statistics.hit_accuracy,
        play_count: user.statistics.play_count,
        level: user.statistics.level.current,
        level_progress: user.statistics.level.progress
      });

    logger.info(`Successfully updated user info for ${user.id} (${user.username}: #${user?.statistics?.global_rank?.toLocaleString()})`)
  }
}