# Introduction

Setting up a bingo game is quick and easy, but is also incredibly customizable if you want it to be. The standard game comes with it’s own rules, (that change depending on if I feel that they are unbalanced for whatever reason), but you can also set up your own game rules.

While support for an actual page to customize these rules in a nice manner is planned, the game should also be fully controllable just by changing the options in the database.

(this is also mostly for my benefit, so I can make sure as I code these properties in, that it matches the spec)

# How it works

Games can be created from **templates**, that hold all the rules that a game uses when it is started. An example of the default template is shown on the right.

When a game is started, the rules are copied from the template’s `data` field, and copied into the game’s `option` field. This means that the game will keep the settings of whatever the template was *when it started*, as opposed to whatever the template currently is.

Templates are just stored as a JSON file, meaning they can be easily manipulated by hand, or read by code (especially considering this whole dang thing is written in javascript)

It consists of three different keys: [[#block|setup]], [[#Board|board]], and [[#Event|event]].

- The `setup` property contains the default map [[#Block|block]]. Squares that do not belong to a [[#Block|block]] will take the properties of this [[#Block|block]].
- The `board` property contains the specification for how the board looks and behaves. For most cases, you can just use one of the default boards which follow the same specification, or if you’re feeling fancy you can create your own.
- The options in the `event` area are configuration options that describe TimeEvents, a database table that allows changes to be made to the rules at specific times

The type for a fully-defined template is as follows:

```tsx
type Template = {
  setup: Block,
  board: string | Board,
  event: Event[]
}
```

```json
{
  "setup": {
    "claim_condition": {
      "metric": "score",
      "quantifier": "gt",
      "value": 300000
    },
    "reclaim_condition": "score",
    "maps": [
      {
        "chance": 0.8,
        "mappool_id": "mpl_youhcNNocsdG",
        "mode": "osu"
      },
      {
        "chance": 0.2,
        "mappool_id": "mpl_YmdAObAQcZEK",
        "mode": "osu"
      }
    ],
  },
  "board": "5x5",
  "event": [
    {
      "seconds_after_start": 1200,
      "event": "claimchange",
      "detail": {
        "condition": {
          "metric": "score",
          "quantifier": "gt",
          "value": 100000
        }
      }
    },
    {
      "seconds_after_start": 1800,
      "event": "finalcall"
    }
  ]
}
```

---

# Block

A block describes the rules for a set of squares on a map that all follow the same rules, whether that be they’re all picked from the same pool, all follow the same claim condition, or are all restricted to the same star rating range. 

The Setup block contains the **default block** for the bingo game. By default, all squares in a board only belong to a single block, which is the one specified there.

For the default block defined in the setup, you are required to provide at least the `claim_condition`, `reclaim_condition`, and `maps` fields. Otherwise, the game wouldn’t have anything to actually build the game with. For blocks defined within boards, all fields are optional, and will inherit from the default block if left undefined.

You can also specify an ID for a block, in order to change the properties of a block using an [[#Event]]

| Property            | type                  | required (setup) | required always |
| ------------------- | --------------------- | ---------------- | --------------- |
| `id`                | string                | ❌                | ❌               |
| `claim_condition`   | [[#ClaimCondition]]   | ✅                | ❌               |
| `reclaim_condition` | [[#ReclaimCondition]] | ✅                | ❌               |
| `maps`              | [[#PickPool]][]       | ✅                | ❌               |
| `multipliers`       | [[#ModMultiplier]][]  | ❌                | ❌               |
| `stars.min`         | number                | ❌                | ❌               |
| `stars.max`         | number                | ❌                | ❌               |
| `length.min`        | number                | ❌                | ❌               |
| `length.max`        | number                | ❌                | ❌               |
| `rank.min`          | number                | ❌                | ❌               |
| `rank.max`          | number                | ❌                | ❌               |

```tsx
type Block = {
  id?: string
	claim_condition: ClaimCondition
	reclaim_condition: string; // ReclaimCondition
	maps: PickPool[];
	multipliers?: ModMultiplier[];
	stars?: {
		min: number;
		max: number;
	},
	length?: {
		min: number;
		max: number;
	}
	rank?: {
		min?: number;
		max?: number;
	}
}
```

## ClaimCondition

The ClaimCondition is a value that gives a description of what requirement a score needs to have in order to be considered “claimworthy”. It is composed of a “metric”, which configures what value the claim checker is actually looking at, then if required, a quantifier and a value to specify what value you actually want.

| Property               | type             | required | Description                                                                                       |
| ---------------------- | ---------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `metric`               | [[#Metric]]      | `true`   | Specifies what the metric is                                                                      |
| `value`                | any              | `false`  | Specify a value to evaluate at if required by the metric                                          |
| `quantifer`            | [[#Quantifiers]] | `false`  | Specify a quantifier to evaluate if required by the metric                                        |
| `allow_diff_reduction` | boolean          | `true`   | Whether to allow scores with mods that reduce the difficulty of the map (includes lazer fun mods) |

### Metric

- `fc`: Claimable if the score is an FC (no slider end drops)
- `rank`: Claimable if the grade is *at least* the specified letter                          **(requires quantifier)**
- `accuracy`: Claimable if the score is *at least* the specified acc                       **(requires quantifier)**
- `pp`: Claimable if the score has at least the specified amount of pp              **(requires quantifier)**
- `miss`: Claimable if the score has less than the specified amount of misses **(requires quantifier)**
- `combo`: Claimable if the score has at least the specified combo                   **(requires quantifier)**
- `score`: Claimable if the score has at least the specified score                     **(requires quantifier)**
- `pass`: Claimable if the user passed (without NF)
- `any`: All scores are claimable (even fails)

### Quantifiers

- `lt` means “less than, not including the value”
- `gt` means “greater than, including the value”
- `eq` means “exactly”

```tsx
type ClaimCondition = {
  metric: string
  quantifier?: 'lt' | 'gt' | 'eq'
  value?: any
  allow_diff_reduction: true
}
```

**Examples:**

```tsx
{
  metric: "score",
  quantifier: "gt",
  value: 300000
}
```

```tsx
{
  metric: "fc"
}
```

```tsx
{
  metric: "rank",
  quantifier: "eq",
  value: "A"
}
```

> [!HINT] Silly Squares
> 
> I’m not specifying it here because this is a feature to be implemented down the road, but one feature that got requested is the concept of “Silly Squares”. Rather than a square being tied to a specific map, it is just tied to a specific condition, and a score on **any map** would claim it.
Examples include:
> - Get a score on a map that has 4 Qs in the artist and title.
> - Get a score on a map with a mod where the map name contains the mod name
> - Get a score on a map where the first three digits of your user ID match the last three digits of the map ID
> 
> This is not being implemented because it would require running user-submitted code (because I’m not coding all those cases myself), and the process of running sandboxed code is a rabbit hole I’m not willing to go down right now.


 

## ReclaimCondition

The reclaim condition is just a string containing a single metric to sort claimable scores by. If a square is already claimed by one team, the square can be reclaimed by another team if they set a score that a) meets the **claim** condition, and b) ranks higher on the metric provided in the **reclaim** condition

- `score` Scores are sorted by score (higher score = reclaim)
- `accuracy` Scores are sorted by accuracy (higher accuracy = reclaim)
- `pp` Scores are sorted by pp (higher pp = reclaim)
- `combo` Scores are sorted by max combo (higher max combo = reclaim)
- `miss` Scores are sorted by miss count (lower miss count = reclaim)
- `all` Scores are sorted by date (newer score = reclaim)
- `none` Scores are sorted inversely by date (commonly known as “lockout” mode)

**Example:**

```tsx
{ reclaim_condition: "score" }
```

## PickPool

To have a bingo board we need maps, and since the quality of the game depends on how good the maps are, there’s lots of options to pick how the maps should be picked.

Maps are picked from **Mappools,** which are pre-defined lists stored elsewhere in the database. 

| property | type | required | default |
| --- | --- | --- | --- |
| `mappool_id` | string | `true` |  |
| `chance` | number | `false` | 1 |
| `mode` | string | `false` |  |

```tsx
type PickPool = {
  mappool_id: string,
  chance?: number,
  mode?: 'osu' | 'fruits' | 'catch' | 'mania'
}
```

## ModMultiplier

You may wish for different mods to be balanced to your choosing, for example making mods like EZ actually viable, undoing the multiplier that the CL mod applies, or nerfing silly lazer mods like MG.

You can specify as many mod multipliers as you like for a block, as well as specifying “exact” multipliers. If a score matches multiple modifiers, 

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| `mod_string` | string | `true` |  | The string of mods to match |
| `multiplier` | number | `true` |  | What multiplier to apply to this rule |
| `exact` | boolean | `false` | false | Whether the mod string needs to match exactly |

<aside>
💡

ModMultipliers from the `setup` block will cascade to other blocks. If you want to overwrite a mod multiplier, you can specify a ModMultiplier in the block you wish to overwrite it in, and as long as the mod string matches **exactly**, it will be overwritten.

</aside>

```tsx
type ModMultiplier = {
  mod_string: string,
  multiplier: number,
  exact?: boolean
}
```

---

# Board

The Board property specifies how exactly the board for the game should be constructed. If you want to use one of the [default boards](https://github.com/clxxiii/osu-bingo/blob/main/src/lib/bingo-helpers/default_boards.ts), you can just specify the name of the board you want to use. If you want to create your own boards, this specification can be used to make more intricate and more specific boards, like allowing you to customize the board shape and size, changing what actually counts as a win, or making squares do funny things.

| property  | type             | description                                                          |
| --------- | ---------------- | -------------------------------------------------------------------- |
| `squares` | [int, int][]     | An array of pairs of (x,y) coordinates                               |
| `lines`   | number[][]       | An array of lists of indices that mark a board as a win              |
| `blocks`  | [[#SquareBlock]] | An array of objects that link a list of indices to a specified block |

## SquareBlock

| property  | type       | description                                            |
| --------- | ---------- | ------------------------------------------------------ |
| `indices` | number[]   | A list of indices that get their rules from this block |
| `block`   | [[#Block]] | The block to apply to the list of squares.             |

> [!HINT] Locking Squares
> Just like SillySquares, not specifying it for now, because it’s a bridge to cross when we get there, and it’s a lot to think about. 
> 
> I’d like to implement a Connect 4 style board, where squares at the bottom have to be claimed *before* squares above it. I haven’t decided how that should actually be specified yet, but it should be some locking system that allows a square to be marked as “locked”, meaning no squares can be submitted on it, and some specification for how these squares are to be unlocked, be it via an event or via another square being claimed.


```tsx
type Board = {
  squares: [number, number][],
  lines?: number[][],
  blocks?: SquareBlock[]
}

type SquareBlock = {
  indices: number[]
  block: Block
}
```

**Example:**

```tsx
	/*
	 * The indices are derived from the order
	 * they appear in the squares array:
	 *
	 * [0][1][2]
	 * [3][4][5]
	 * [6][7][8]
	 */
	'3x3': {
		"squares": [
			[0, 0], [0, 1], [0, 2],
			[1, 0], [1, 1], [1, 2],
			[2, 0], [2, 1], [2, 2],
		],
		"lines": [
			// Horizontal
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			// Vertical
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			// Diagonal
			[0, 4, 8],
			[2, 4, 6]
		]
	},
```

---

# Event

If the game’s rules don’t change over time, players have the potential to get stuck. **Events** allow the game to change as the game progresses, and to have a set final tiebreaker, in the case that the game starts running too long.

| property              | type                                                                                              | description                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `seconds_after_start` | number                                                                                            | How long (in seconds) after the start of the match to trigger the event |
| `event`               | [EventType](https://www.notion.so/osu-Bingo-Options-Spec-1b23f4b9c82c800499bbd95c9fccbbab?pvs=21) | The type of event to trigger                                            |
| `detail`              | any                                                                                               | Additional details for an event if required                             |

```tsx
type Event = {
  seconds_after_start: number;
  event: string; // EventType
  detail?: any
}
```

## EventType

Two different types of events exist to schedule during the game:

- Mid-game events keep the game going, but change something about the game
- Final events either end the game, or put the game into a different state that cannot be undone.

### Mid-game events

The following events are mid-game events. You can schedule as many mid-game events as you’d like, as long as two events do not occur at the same time.

`claimchange`

---

Changes the claim condition for the default block, or the block provided with the given ID

**Detail:** Requires the ClaimCondition you want to change to, and optionally, the ID of the block you want to change:

```tsx
{
  condition: ClaimCondition,
  id?: string
}
```

`reclaimchange`

---

Changes the reclaim condition for the default block, or the block provided with the given ID

**Detail:** Requires the ReclaimCondition you want to change to, and optionally, the ID of the block you want to change:

```tsx
{
  condition: ReclaimCondition,
  id?: string
}
```

### Final Events

The following events will end the game, or put the game into an ending state. You can only have one of this type of event, and it must be the last event to occur.

#### `finaldraw`
Ends the game, doesn’t decide a winner, and calls it a draw.

**Detail:** none

#### `finalcall`
Ends the game, and decides a winner based on tiebreaker conditions:

- The team with the most squares claimed is selected as the winner
- If that’s a tie, each square’s highest reclaim condition is averaged together, and the highest score wins
- If that’s a tie, go buy a lottery ticket because how tf would that EVER happen (the game just considers it a draw)

**Detail:** none

#### `finalshowdown`

Brings the game into a final tiebreaker showdown:

- Bingo board is declared as a tie, and a final map that isn’t on the board is picked.
- Each user submitted score adds their score (according to the reclaim condition) to their team’s score, the team with the higher score wins.

**Detail:** You can specify a custom block for the tiebreaker map, otherwise it will use the default. If you want to specify how long this phase lasts, you can do that, otherwise it’ll default to the length of the map * 1.5, to allow for downloads and retries, but only one submitted attempt (unless you wanna try & DT)

```tsx
{
  block?: Block,
  length_seconds?: number
}
```