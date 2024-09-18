import boards from './default_boards';

const default_lines = [
	// horizontal lines
	[0, 1, 2, 3, 4],
	[5, 6, 7, 8, 9],
	[10, 11, 12, 13, 14],
	[15, 16, 17, 18, 19],
	[20, 21, 22, 23, 24],
	// vertical lines
	[0, 5, 10, 15, 20],
	[1, 6, 11, 16, 21],
	[2, 7, 12, 17, 22],
	[3, 8, 13, 18, 23],
	[4, 9, 14, 19, 24],
	// diagonal lines
	[0, 6, 12, 18, 24],
	[4, 8, 12, 16, 20]
];

/**
 * Checks if a bingo board is a bingo
 */
export const checkWin = (game: Bingo.Card) => {
	if (!game.squares) return null;

	// Arrange the board into a 2D array.
	const yMax = Math.max(...game.squares.map((x) => x.y_pos));
	const xMax = Math.max(...game.squares.map((x) => x.x_pos));

	const board: (string | null)[] = new Array((yMax + 1) * (xMax + 1));
	for (const square of game.squares) {
		const index = square.y_pos * 5 + square.x_pos;
		board[index] = square.claimed_by?.team_name ?? null;
	}

	// Get lines from template
	let template: Template;
	try {
		template = JSON.parse(game.template.data);
	} catch {
		return bingoCheck(board);
	}
	const { lines } =
		typeof template.setup.board == 'string' ? boards[template.setup.board] : template.setup.board;

	return bingoCheck(board, lines);
};

/**
 * Checks if a board has bingo on it using
 * pre-defined lines.
 */
export const bingoCheck = (board: (string | null)[], lines?: number[][]) => {
	lines = lines ?? default_lines;

	for (const line of lines) {
		let check: string | null = board[line[0]];
		for (const cell of line) {
			if (check != board[cell]) {
				check = null;
			}
		}
		if (check != null)
			return {
				winner: check,
				line
			};
	}

	return null;
};
