import type { Osu } from "$lib/osu";
import { test, expect, beforeEach, assert, afterEach } from "vitest";
import { isClaimworthy } from "./claimworthy";
import type { Options } from "$lib/gamerules/options";

const exampleScore: Osu.LazerScore = {
  "classic_total_score": 7602279,
  "preserve": true,
  "processed": true,
  "ranked": true,
  "maximum_statistics": {
    "great": 495,
    "legacy_combo_increase": 180
  },
  "mods": [
    {
      "acronym": "CL"
    }
  ],
  "statistics": {
    "ok": 5,
    "great": 490
  },
  "beatmap_id": 848994,
  "best_id": null,
  "id": 1215149162,
  "rank": "S",
  "type": "solo_score",
  "user_id": 10962678,
  "accuracy": 0.993266,
  "build_id": null,
  "ended_at": "2021-04-16T02:16:56Z",
  "has_replay": false,
  "is_perfect_combo": true,
  "legacy_perfect": true,
  "legacy_score_id": 3601249573,
  "legacy_total_score": 10344580,
  "max_combo": 675,
  "passed": true,
  "pp": 225.032,
  "ruleset_id": 0,
  "total_score": 940822,
  "replay": false,
  "beatmap": {
    "beatmapset_id": 389343,
    "difficulty_rating": 5.69,
    "id": 848994,
    "mode": "osu",
    "status": "ranked",
    "total_length": 116,
    "user_id": 899031,
    "version": "M@gic",
    "accuracy": 8.5,
    "ar": 9.3,
    "bpm": 178,
    "convert": false,
    "count_circles": 318,
    "count_sliders": 176,
    "count_spinners": 1,
    "cs": 4,
    "deleted_at": null,
    "drain": 6,
    "hit_length": 116,
    "is_scoreable": true,
    "last_updated": "2016-07-21T09:09:59Z",
    "mode_int": 0,
    "passcount": 84086,
    "playcount": 1186412,
    "ranked": 1,
    "url": "https://osu.ppy.sh/beatmaps/848994",
    "checksum": "856a5a3bc98d7755c18868c4bcd913f1"
  },
  "beatmapset": {
    "artist": "CINDERELLA PROJECT",
    "artist_unicode": "CINDERELLA PROJECT",
    "covers": {
      "cover": "https://assets.ppy.sh/beatmaps/389343/covers/cover.jpg?1650635503",
      "cover@2x": "https://assets.ppy.sh/beatmaps/389343/covers/cover@2x.jpg?1650635503",
      "card": "https://assets.ppy.sh/beatmaps/389343/covers/card.jpg?1650635503",
      "card@2x": "https://assets.ppy.sh/beatmaps/389343/covers/card@2x.jpg?1650635503",
      "list": "https://assets.ppy.sh/beatmaps/389343/covers/list.jpg?1650635503",
      "list@2x": "https://assets.ppy.sh/beatmaps/389343/covers/list@2x.jpg?1650635503",
      "slimcover": "https://assets.ppy.sh/beatmaps/389343/covers/slimcover.jpg?1650635503",
      "slimcover@2x": "https://assets.ppy.sh/beatmaps/389343/covers/slimcover@2x.jpg?1650635503"
    },
    "creator": "Lami",
    "favourite_count": 426,
    "hype": null,
    "id": 389343,
    "nsfw": false,
    "offset": 0,
    "play_count": 3119452,
    "preview_url": "//b.ppy.sh/preview/389343.mp3",
    "source": "アイドルマスター シンデレラガールズ",
    "spotlight": false,
    "status": "ranked",
    "title": "M@GIC*",
    "title_unicode": "M@GIC☆",
    "track_id": null,
    "user_id": 899031,
    "video": false
  },
  "user": {
    "avatar_url": "https://a.ppy.sh/10962678?1689374713.jpeg",
    "country_code": "US",
    "default_group": "default",
    "id": 10962678,
    "is_active": true,
    "is_bot": false,
    "is_deleted": false,
    "is_online": false,
    "is_supporter": false,
    "last_visit": "2024-10-13T15:45:56+00:00",
    "pm_friends_only": false,
    "profile_colour": null,
    "username": "clx"
  },
}

let testData: Osu.LazerScore | null = null;

// Reset test data before each test
beforeEach(() => { testData = { ...exampleScore } })

test("FC Tests", () => {
  if (testData == null) assert.fail("testData is null");
  testData.is_perfect_combo = false;
  testData.passed = false;
  expect(isClaimworthy(testData, { metric: "fc", allow_diff_reduction: true })).toBe(false)

  testData.is_perfect_combo = true;
  expect(isClaimworthy(testData, { metric: "fc", allow_diff_reduction: true })).toBe(false)

  testData.passed = true;
  expect(isClaimworthy(testData, { metric: "fc", allow_diff_reduction: true })).toBe(true)
})

test("Rank Tests", () => {
  if (testData == null) assert.fail("testData is null");
  testData.passed = true;
  testData.rank = 'A';

  const options: Options.ClaimCondition = { allow_diff_reduction: true, metric: "rank", quantifier: 'gt' }

  // Check that example rank works properly
  expect(isClaimworthy(testData, { ...options, value: "ssh" })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: "ss" })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: "sh" })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: "s" })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: "a" })).toBe(true)
  expect(isClaimworthy(testData, { ...options, value: "b" })).toBe(true)
  expect(isClaimworthy(testData, { ...options, value: "c" })).toBe(true)
  expect(isClaimworthy(testData, { ...options, value: "d" })).toBe(true)
  expect(isClaimworthy(testData, { ...options, value: "f" })).toBe(true)

  testData.passed = false;
  expect(isClaimworthy(testData, { ...options, value: "a" })).toBe(false)
})

test("PP Tests", () => {
  if (testData == null) assert.fail("testData is null");
  testData.passed = true;
  testData.pp = 190.2;

  const options: Options.ClaimCondition = { allow_diff_reduction: true, metric: "pp", quantifier: 'gt' }

  expect(isClaimworthy(testData, { ...options, value: 200 })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: 210.40 })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: 190.30 })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: 190.20 })).toBe(true)
  expect(isClaimworthy(testData, { ...options, value: 190.10 })).toBe(true)
  expect(isClaimworthy(testData, { ...options, value: 190 })).toBe(true)
  expect(isClaimworthy(testData, { ...options, value: 100 })).toBe(true)

  testData.passed = false;
  expect(isClaimworthy(testData, { ...options, value: 100 })).toBe(false)
})

test("Miss Tests", () => {
  if (testData == null) assert.fail("testData is null");
  testData.passed = true;
  testData.statistics.miss = 5;

  const options: Options.ClaimCondition = { allow_diff_reduction: true, metric: "miss", quantifier: 'lt' }

  expect(isClaimworthy(testData, { ...options, value: 10 })).toBe(true)
  expect(isClaimworthy(testData, { ...options, value: 6 })).toBe(true)
  expect(isClaimworthy(testData, { ...options, value: 5 })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: 4 })).toBe(false)

  testData.passed = false;
  expect(isClaimworthy(testData, { ...options, value: 10 })).toBe(false)
})

test("Combo Tests", () => {
  if (testData == null) assert.fail("testData is null");
  testData.passed = true;
  testData.max_combo = 75

  const options: Options.ClaimCondition = { allow_diff_reduction: true, metric: "combo", quantifier: 'gt' }

  expect(isClaimworthy(testData, { ...options, value: 100 })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: 76 })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: 75 })).toBe(true)
  expect(isClaimworthy(testData, { ...options, value: 74 })).toBe(true)

  testData.passed = false;
  expect(isClaimworthy(testData, { ...options, value: 60 })).toBe(false)
})

test("Score Tests", () => {
  if (testData == null) assert.fail("testData is null");
  testData.passed = true;
  testData.total_score = 350_000;

  const options: Options.ClaimCondition = { allow_diff_reduction: true, metric: "score", quantifier: 'gt' }

  expect(isClaimworthy(testData, { ...options, value: 1000000 })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: 400000 })).toBe(false)
  expect(isClaimworthy(testData, { ...options, value: 350000 })).toBe(true)
  expect(isClaimworthy(testData, { ...options, value: 300000 })).toBe(true)

  testData.passed = false;
  expect(isClaimworthy(testData, { ...options, value: 100000 })).toBe(false)
})

test("Pass Tests", () => {
  if (testData == null) assert.fail("testData is null");

  const options: Options.ClaimCondition = { allow_diff_reduction: true, metric: "pass" }

  testData.passed = false;
  expect(isClaimworthy(testData, options)).toBe(false);

  testData.passed = true;
  expect(isClaimworthy(testData, options)).toBe(true);

  testData.mods = [{ acronym: "NF" }]
  expect(isClaimworthy(testData, options)).toBe(false);
})

test("Quantifier Tests", () => {
  if (testData == null) assert.fail("testData is null");
  testData.passed = true;

  const options: Options.ClaimCondition = { allow_diff_reduction: true, metric: "rank", value: 'a' }

  testData.rank = 'A';
  expect(isClaimworthy(testData, { ...options, quantifier: 'lt' })).toBe(false)
  expect(isClaimworthy(testData, { ...options, quantifier: 'eq' })).toBe(true)
  expect(isClaimworthy(testData, { ...options, quantifier: 'gt' })).toBe(true)

  testData.rank = 'B';
  expect(isClaimworthy(testData, { ...options, quantifier: 'lt' })).toBe(true)
  expect(isClaimworthy(testData, { ...options, quantifier: 'eq' })).toBe(false)
  expect(isClaimworthy(testData, { ...options, quantifier: 'gt' })).toBe(false)

  testData.rank = 'S';
  expect(isClaimworthy(testData, { ...options, quantifier: 'lt' })).toBe(false)
  expect(isClaimworthy(testData, { ...options, quantifier: 'eq' })).toBe(false)
  expect(isClaimworthy(testData, { ...options, quantifier: 'gt' })).toBe(true)
})