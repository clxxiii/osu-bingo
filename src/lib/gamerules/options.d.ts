export type Options = {
  setup: Options.Block,
  board: string | Options.Board,
  event: Options.Event[]
}

export namespace Options {
  type Block = {
    id?: string;
    claim_condition: Options.ClaimCondition;
    reclaim_condition: Options.ReclaimCondition;
    maps: Options.PickPool[];
    multipliers: Options.Multipliers[];
    stars?: {
      min: number
      max: number
    }
    length?: {
      min: number
      max: number
    }
    rank?: {
      min?: number
      max?: number
    }
  }

  type ClaimMetric = "fc" | "rank" | "pp" | "miss" | "combo" | "score" | "pass" | "any"
  type ClaimCondition = {
    metric: Options.ClaimMetric,
    quantifier?: "lt" | "gt" | "eq",
    value?: any,
    allow_diff_reduction: true
  }

  type ReclaimCondition = "score" | "accuracy" | "pp" | "combo" | "miss" | "all" | "none"

  type PickPool = {
    mappool_id: string,
    chance?: number,
    mode?: 'osu' | 'fruits' | 'catch' | 'mania'
  }

  type ModMultiplier = {
    mod_string: string,
    multiplier: number
    exact?: boolean
  }

  type Board = {
    squares: [number, number][],
    lines?: number[][],
    blocks?: Options.SquareBlock[]
  }

  type SquareBlock = {
    indices: number[],
    block: Options.Block
  }

  type Event = {
    seconds_after_start: number,
    event: Options.EventType,
    detail?: any
  }

  type EventType = "claimchange" | "reclaimchange" | "finaldraw" | "finalcall" | "finalshowdown"
}

// Although almost identical to Options.Block, this type needs to exist
// to differentiate between options that are used to specify, and options
// that are used when they actually need to be used.
// 
// e.g. Combine ModMultipliers, force a claim_condition etc.
export type GameRules = {
  claim_condition: Options.ClaimCondition,
  reclaim_condition: Options.ReclaimCondition,
  multipliers: Options.ModMultiplier[],
  stars?: {
    min: number
    max: number
  }
  length?: {
    min: number
    max: number
  }
  rank?: {
    min?: number
    max?: number
  }
}