/*
* [00][01][02]
* [03][04][05]
* [06][07][08]
*/
const squares: [number, number][] = [
  [0, 0], [0, 1], [0, 2],
  [1, 0], [1, 1], [1, 2],
  [2, 0], [2, 1], [2, 2],
]
const lines = [
  // H
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // V
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // D
  [0, 4, 8],
  [2, 4, 6]
]

export const board = { squares, lines }
export const board_nolines = { squares, lines: [] }