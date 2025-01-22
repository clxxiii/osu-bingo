<script lang="ts">
	import { checkWin } from '$lib/bingo-helpers/check_win';
	import type { Writable } from 'svelte/store';

	export let cardStore: Writable<Bingo.Card | null>;
	export let cardPadding = 5;
	export let padding = 5;
	export let rounded = true;

	let yMax: number;
	let xMax: number;

	let winningLine: number[] | null = null;

	cardStore.subscribe((card) => {
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
</script>

<div
	class="grid w-full rounded p-[var(--p2)]"
	style="
  --p2: {cardPadding}px;
	grid-template-columns: repeat({xMax + 1}, {xMax + 1}fr); 
	grid-template-rows: repeat({yMax + 1}, {yMax + 1}fr);
	aspect-ratio: {xMax + 1} / {yMax + 1}
	"
>
	{#if $cardStore && $cardStore.squares}
		{#each $cardStore.squares as square, i}
			<div
				class="p-[var(--p)]"
				style="grid-area: {square.y_pos + 1} / {square.x_pos + 1} / {square.y_pos +
					2} / {square.x_pos + 2}; --p: {padding}px; --r: {rounded ? padding : 0}px"
			>
				<div
					class="size-full rounded-[var(--r)] bg-base-700 data-[winning=true]:animate-pulse data-[team=BLUE]:bg-blue-600 data-[team=RED]:bg-red-500"
					data-team={square.claimed_by?.team_name.toUpperCase()}
					data-winning={winningLine?.includes(i)}
				></div>
			</div>
		{/each}
	{/if}
</div>
