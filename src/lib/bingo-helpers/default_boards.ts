import type { Options } from "$lib/gamerules/options";
import { board as threewide, board_nolines as threewide_nolines } from "./boards/3x3"
import { board as fivewide, board_nolines as fivewide_nolines } from "./boards/5x5"
import { board as sevenwide, board_nolines as sevenwide_nolines } from "./boards/7x7"

const boards: { [key: string]: Options.Board } = {
	'3x3': threewide,
	'3x3_noline': threewide_nolines,
	'5x5': fivewide,
	'5x5_noline': fivewide_nolines,
	'7x7': sevenwide,
	'7x7_noline': sevenwide_nolines,
};

export default boards;
