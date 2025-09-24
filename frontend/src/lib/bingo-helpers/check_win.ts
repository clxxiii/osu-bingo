import type { Options } from '$lib/gamerules/options';
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

	// Get board and lines from template
	let template: Options;
	try {
		template = JSON.parse(game.template.data);
	} catch {
		throw "Template is invalid";
	}

	// Get board and lines from template
	let board: Options.Board;
	if (typeof template.board == 'string') {
		board = boards[template.board];
	} else {
		board = template.board;
	}

	if (!board) {
		throw "Template does not have a valid board";
	}

	const boardMarks: (string | null)[] = new Array(board.squares.length);
	for (let i = 0; i < board.squares.length; i++) {
		const coords = board.squares[i];
		const square = game.squares.find((x) => ((x.x_pos == coords[1]) && (x.y_pos == coords[0])))
		if (!square) continue;
		boardMarks[i] = square.claimed_by?.team_name?.toUpperCase() ?? null
	}

	return bingoCheck(boardMarks, board.lines);
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
