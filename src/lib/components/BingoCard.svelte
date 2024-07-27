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

	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	const click = (s: Bingo.Card.FullSquare) => {
		const index = $store.squares?.findIndex((x) => x.id == s.id);
		if (!index) return;
		$square = index;
	};
</script>

<div
	transition:scale={{ delay: 300 }}
	class="grid p-2 bg-base-950 w-full max-w-[560px] rounded"
	style="
	grid-template-columns: 30px repeat({xMax + 1}, {xMax + 1}fr); 
	grid-template-rows: 30px repeat({yMax + 1}, {yMax + 1}fr);
	aspect-ratio: {xMax + 1} / {yMax + 1}
	"
>
	{#if $store.squares}
		<img src="/icon.svg" class="grayscale" alt="" />
		{#each new Array(xMax + 1) as _, i}
			<div
				class="w-full flex items-center justify-center font-bold text-zinc-500"
				style="grid-area: 1 / {i + 2} / 2 / {i + 3}"
			>
				{alphabet.charAt(i)}
			</div>
		{/each}
		<!-- Column Labels -->
		{#each new Array(xMax + 1) as _, i}
			<div
				class="w-full flex items-center justify-center font-bold text-zinc-500"
				style="grid-area: 1 / {i + 2} / 2 / {i + 3}"
			>
				{alphabet.charAt(i)}
			</div>
		{/each}
		<!-- Row Labels -->
		{#each new Array(yMax + 1) as _, i}
			<div
				class="w-full flex items-center justify-center font-bold font-display text-zinc-500"
				style="grid-area: {i + 2} / 1 / {i + 3} / 2"
			>
				{i + 1}
			</div>
		{/each}
		{#each $store.squares as square}
			<div
				class="p-2"
				style="grid-area: {square.y_pos + 2} / {square.x_pos + 2} / {square.y_pos +
					3} / {square.x_pos + 3}"
			>
				<BingoSquare {store} on:click={() => click(square)} {square} />
			</div>
		{/each}
	{/if}
</div>
