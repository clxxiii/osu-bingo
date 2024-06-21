/**
 * Checks if a bingo board is a bingo
 * 
 * This function currently assumes that the board
 * is a 5x5 square. The database has functionality to
 * have custom boards, so eventually, this should
 * support that as well.
 */
export const checkWin = (game: Bingo.Card) => {
  if (!game.squares) return;

  // Arrange the board into a 2D array.
  const yMax = Math.max(...game.squares.map((x) => x.y_pos));
  const xMax = Math.max(...game.squares.map((x) => x.x_pos));

  const board: (string | null)[] = new Array((yMax + 1) * (xMax + 1));
  for (const square of game.squares) {
    const index = (square.y_pos * 5) + (square.x_pos);
    board[index] = square.claimed_by?.team_name ?? null;
  }
  return bingoCheck(board);
}

/**
 * Checks if a board has bingo on it using
 * pre-defined lines.
 * 
 * [00][01][02][03][04]
 * [05][06][07][08][09]
 * [10][11][12][13][14]
 * [15][16][17][18][19]
 * [20][21][22][23][24]
 */
export const bingoCheck = (board: (string | null)[]) => {

  const lines = [
    // Horizontal Lines
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    // Vertical Lines
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    // Diagonal Lines
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]
  ]

  for (const line of lines) {
    let check: string | null = board[line[0]];
    for (const cell of line) {
      if (check != board[cell]) {
        check = null
      }
    }
    if (check != null) return {
      winner: check,
      line
    }
  }


  return null;
}