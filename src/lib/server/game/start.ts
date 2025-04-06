/**
 * Starts a bingo game!
 */

import q from '$lib/drizzle/queries';
import { addGame } from './watch';
import boards from '$lib/bingo-helpers/default_boards';
import { logger } from '$lib/logger';
import { sendToGame } from '$lib/emitter/server';
import { clearTimer } from './auto_deletion';
import type { Options } from '$lib/gamerules/options';

export const startGame = async (game_id: string) => {
	logger.info(`Starting game ${game_id}!`, { type: 'game_start' });
	const now = Date.now();
	clearTimer(game_id);

	const game = await q.getGame(game_id);
	if (!game) return;

	// Merge options from template with game-specific options
	const template: Options = JSON.parse(game.template.data);
	const gameOptions: Options = JSON.parse(game.options);

	const options = { ...template, ...gameOptions, setup: { ...template.setup, ...gameOptions.setup } }

	// Grab board from default boards if necessary
	const board =
		typeof options.board == 'string' ? boards[options.board] : options.board;
	options.board = board;

	await q.updateGameOptions(game_id, options);

	// ===========
	// MAP PICKING
	// ===========


	// Group squares via block
	const blocks: { block: Options.Block, squares: [number, number][] }[] = []
	for (let i = 0; i < board.squares.length; i++) {
		let block = board.blocks?.find(x => x.indices.includes(i))?.block;
		if (!block) block = options.setup;

		const blocksIdx = blocks.findIndex(x => x.block == block);
		if (blocksIdx != -1) {
			blocks[blocksIdx].squares.push(board.squares[i]);
		} else {
			blocks.push({ block, squares: [board.squares[i]] })
		}
	}

	// Pick maps in each block
	for (const { block, squares } of blocks) {
		const totalChance = block.maps.reduce((a, b) => a + (b.chance ?? 1), 0);

		// Calculate how many maps in each pool to fetch
		const counts = [];
		for (const mappool of block.maps) {
			const chance = (mappool.chance ?? 1) / totalChance;
			counts.push({
				mappool,
				maps: Math.floor(squares.length * chance),
			});
		}

		// If the count doesn't add up to the number of squares, add the difference to the smallest pool
		if (counts.map((x) => x.maps).reduce((a, b) => a + b) < squares.length) {
			counts.sort((a, b) => a.maps - b.maps);
			counts[0].maps += squares.length - counts.map((x) => x.maps).reduce((a, b) => a + b);
		}
		console.log(counts);

		// Fetch maps in all the pools
		const maps = [];
		for (const pool of counts) {
			if (pool.maps == 0) continue;

			const picks = await q.getRandomMaps(
				pool.mappool.mappool_id,
				pool.maps,
				// Pick block's settings, or fallback to default block's settings
				block.stars?.min ?? options.setup.stars?.min,
				block.stars?.max ?? options.setup.stars?.max,
				block.length?.min ?? options.setup.length?.min,
				block.length?.max ?? options.setup.length?.max,
				pool.mappool.mode
			);
			maps.push(...picks);
		}

		// Shuffle maps
		maps.sort(() => (Math.random() > 0.5 ? -1 : 1));
		for (let i = 0; i < squares.length; i++) {
			const square = squares[i];
			await q.newSquare({
				game_id,
				map_id: maps[i].id,
				x_pos: square[0],
				y_pos: square[1]
			});
		}
	}

	// Create Events
	for (const event of template.event) {
		const date = new Date(now + event.seconds_after_start * 1000);
		await q.setEvent(game_id, event.event, date);
	}

	// Update last settings and send game to clients
	await q.setGameState(game.id, 1);
	await q.setStartTime(game.id, new Date(now));
	addGame(game_id);
	sendToGame(game_id, {
		type: 'state',
		data: {
			state: 1,
			card: await q.getGame(game_id)
		}
	});
};
