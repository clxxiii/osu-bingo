<script lang="ts">
	import type { Writable } from 'svelte/store';
	import BingoSquare from './BingoSquare.svelte';
	import { square } from '$lib/stores';
	import { checkWin } from '$lib/bingo-helpers/check_win';
	import boards from '$lib/bingo-helpers/default_boards';
	import LoadingIcon from './LoadingIcon.svelte';

	export let store: Writable<Bingo.Card | null>;
	let yMax: number;
	let xMax: number;

	let square_width: number;

	let winningLine: number[] | null = null;

	store.subscribe((card) => {
		if (!card) return;

		if (card.squares) {
			yMax = Math.max(...card.squares.map((x) => x.y_pos));
			xMax = Math.max(...card.squares.map((x) => x.x_pos));
		}
		const win = checkWin(card);
		if (win) {
			winningLine = win.line;
		}
	});

	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	const click = (s: Bingo.Card.FullSquare) => {
		const index = $store?.squares?.findIndex((x) => x.id == s.id);
		if (index == undefined) return;
		$square = index;
	};
</script>

{#if $store && $store.squares}
	<div
		class="grid w-full rounded bg-base-950 p-2"
		bind:clientWidth={square_width}
		style="
	grid-template-columns: 30px repeat({xMax + 1}, {xMax + 1}fr); 
	grid-template-rows: 30px repeat({yMax + 1}, {yMax + 1}fr);
	aspect-ratio: {xMax + 1} / {yMax + 1}
	"
	>
		<img src="/icon.svg" class="grayscale" alt="" />
		<!-- Column Labels -->
		{#each new Array(xMax + 1) as _, i}
			<div
				class="flex w-full items-center justify-center font-bold text-zinc-500"
				style="grid-area: 1 / {i + 2} / 2 / {i + 3}"
			>
				{alphabet.charAt(i)}
			</div>
		{/each}
		<!-- Row Labels -->
		{#each new Array(yMax + 1) as _, i}
			<div
				class="flex w-full items-center justify-center font-display font-bold text-zinc-500"
				style="grid-area: {i + 2} / 1 / {i + 3} / 2"
			>
				{i + 1}
			</div>
		{/each}
		{#each $store.squares as square, i}
			<div
				style="grid-area: {square.y_pos + 2} / {square.x_pos + 2} / {square.y_pos +
					3} / {square.x_pos + 3}; padding: {square_width / 100}px"
			>
				<BingoSquare
					{store}
					on:click={() => click(square)}
					{square}
					blinking={winningLine?.includes(i)}
				/>
			</div>
		{/each}
	</div>
{:else}
	<div class="relative grid gap-4 rounded-xl bg-base-950 p-4">
		{#each boards['5x5'].squares as square}
			<div
				style="grid-area: {square[1] + 1} / {square[0] + 1} / {square[1] + 2} / {square[0] +
					2}; padding: {square_width / 100}px"
			>
				<div
					class="size-full animate-pulse rounded-xl bg-zinc-900"
					style="animation-delay: {(square[0] + square[1]) * 500}ms; animation-duration: 5000ms"
				></div>
			</div>
		{/each}
		<div class="absolute flex size-full items-center justify-center">
			<div
				class="rounded-xl border-2 border-white/20 bg-black/25 p-4 py-6 font-display text-xl font-bold backdrop-blur-sm"
			>
				<div>Waiting for the game to start</div>
				<div class="mt-2 flex justify-center">
					<LoadingIcon size={30} />
				</div>
			</div>
		</div>
	</div>
{/if}
