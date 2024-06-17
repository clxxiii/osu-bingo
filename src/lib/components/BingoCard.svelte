<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import BingoSquare from './BingoSquare.svelte';

	export let card: Bingo.Card;
	const squares = card.squares;
	let yMax: number;
	let xMax: number;
	if (squares) {
		yMax = Math.max(...squares.map((x) => x.y_pos));
		xMax = Math.max(...squares.map((x) => x.x_pos));
	}

	const dispatch = createEventDispatcher();
	const click = (square: Bingo.Card.FullSquare) => {
		dispatch('squareclick', square);
	};
</script>

<div
	class="grid p-2 bg-base-950 w-full max-w-[500px] rounded"
	style="
	grid-template-columns: repeat({xMax + 1}, {xMax + 1}fr); 
	grid-template-rows: repeat({yMax + 1}, {yMax + 1}fr);
	aspect-ratio: {xMax + 1} / {yMax + 1}
	"
>
	{#if squares}
		{#each squares as square}
			<div
				class="p-2"
				style="grid-area: {square.y_pos + 1} / {square.x_pos + 1} / {square.y_pos +
					2} / {square.x_pos + 2}"
			>
				<BingoSquare on:click={() => click(square)} {square} />
			</div>
		{/each}
	{/if}
</div>
