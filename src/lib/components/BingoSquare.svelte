<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import OsuModeIcon from '$lib/components/OsuModeIcon.svelte';

	export let square: Bingo.Card.FullSquare;
	export let store: Writable<Bingo.Card>;

	export let blinking = false;
	export let bouncing = false;

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
	data-animation={blinking ? 'blinking' : bouncing ? 'bouncing' : ''}
	class="square group relative z-0 block h-full w-full overflow-hidden rounded bg-black transition data-[animation=blinking]:animate-pulse data-[animation=bouncing]:animate-bounce"
	on:click={click}
>
	<div class="background absolute top-0 -z-10 size-full transition">
		{#if claimed === 'RED'}
			<div class="absolute top-0 z-10 size-full bg-amber-600 opacity-70"></div>
			<div class="bg-img absolute top-0 z-0 size-full grayscale"></div>
		{:else if claimed === 'BLUE'}
			<div class="absolute top-0 z-10 size-full bg-blue-600 opacity-70"></div>
			<div class="bg-img absolute top-0 z-0 size-full grayscale"></div>
		{:else}
			<div
				class="bg-img absolute top-0 z-0 size-full grayscale-[100%] transition hover:grayscale-[0%]"
			></div>
		{/if}
	</div>
	<div class="popout-box font-display">
		<div
			class="pointer-events-none absolute bottom-0 left-0 z-20 flex w-12 items-center justify-center gap-1 rounded-tr bg-zinc-900 font-rounded text-xs font-bold"
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
