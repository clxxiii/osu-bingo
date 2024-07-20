<script lang="ts">
	import type { Writable } from 'svelte/store';
	import BingoSquare from './BingoSquare.svelte';
	import { scale } from 'svelte/transition';
	import { square } from '$lib/stores';

	export let store: Writable<Bingo.Card>;
	let yMax: number;
	let xMax: number;

	store.subscribe((card) => {
		if (card.squares) {
			yMax = Math.max(...card.squares.map((x) => x.y_pos));
			xMax = Math.max(...card.squares.map((x) => x.x_pos));
		}
	});

	const click = (s: Bingo.Card.FullSquare) => {
		$square = s;
	};
</script>

<div
	transition:scale={{ delay: 300 }}
	class="grid p-2 bg-base-950 w-full max-w-[500px] rounded"
	style="
	grid-template-columns: repeat({xMax + 1}, {xMax + 1}fr); 
	grid-template-rows: repeat({yMax + 1}, {yMax + 1}fr);
	aspect-ratio: {xMax + 1} / {yMax + 1}
	"
>
	{#if $store.squares}
		{#each $store.squares as square}
			<div
				class="p-2"
				style="grid-area: {square.y_pos + 1} / {square.x_pos + 1} / {square.y_pos +
					2} / {square.x_pos + 2}"
			>
				<BingoSquare {store} on:click={() => click(square)} {square} />
			</div>
		{/each}
	{/if}
</div>
