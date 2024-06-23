<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import OsuModeIcon from '$lib/components/OsuModeIcon.svelte';

	export let square: Bingo.Card.FullSquare;
	export let store: Writable<Bingo.Card>;

	onMount(() => {
		store.subscribe((card) => {
			if (!card.squares) return;

			square = card.squares
				.filter((x) => x.x_pos == square.x_pos)
				.filter((x) => x.y_pos == square.y_pos)[0];
		});
	});

	const dispatch = createEventDispatcher();

	const difficulty = square.data.stats.star_rating.toFixed(2);
	let claimed: string;

	$: claimed = square.claimed_by?.team_name ?? 'UNCLAIMED';

	const click = () => {
		dispatch('click');
	};
</script>

<button
	style="--url: url({square.data.square_url})"
	class="block group transition bg-black relative square z-0 w-full h-full overflow-hidden rounded"
	on:click={click}
>
	<div class="background absolute top-0 size-full -z-10 transition">
		{#if claimed === 'RED'}
			<div class="absolute top-0 size-full bg-amber-600 z-10 opacity-70"></div>
			<div class="absolute bg-img top-0 size-full z-0 grayscale"></div>
		{:else if claimed === 'BLUE'}
			<div class="absolute top-0 size-full bg-blue-600 z-10 opacity-70"></div>
			<div class="absolute bg-img top-0 size-full z-0 grayscale"></div>
		{:else}
			<div
				class="transition absolute bg-img top-0 size-full z-0 grayscale-[100%] hover:grayscale-[0%]"
			></div>
		{/if}
	</div>
	<div class="popout-box font-display">
		<div
			class="flex items-center justify-center gap-1 font-rounded font-bold text-xs rounded-tr absolute w-12 bottom-0 left-0 bg-zinc-900 z-20 pointer-events-none"
		>
			<OsuModeIcon mode={square.data.gamemode} size={12} />
			{difficulty}
		</div>
	</div>
</button>

<style>
	div.bg-img {
		background: var(--url);
		background-size: cover;
		background-position: 50% 50%;
	}
	button:hover {
		transform: translateY(-5px);
		box-shadow: 0px 10px 8px rgba(0, 0, 0, 0.3);
	}
</style>
