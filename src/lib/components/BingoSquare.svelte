<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let square: Bingo.Card.FullSquare;

	const dispatch = createEventDispatcher();

	const difficulty = square.data.stats.star_rating.toFixed(2);
	const claimed = square.claimed_by ?? 'UNCLAIMED';

	const click = () => {
		dispatch('click');
	};
</script>

<button
	style="--url: url({square.data.cover_url})"
	class="block transition bg-black relative square z-0 w-full h-full overflow-hidden rounded"
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
			<div class="absolute bg-img top-0 size-full z-0"></div>
		{/if}
	</div>
	<div class="popout-box font-display">
		<div
			class="font-rounded font-bold text-xs rounded-tr absolute w-10 bottom-0 left-0 bg-zinc-900 z-20 pointer-events-none"
		>
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
	button:hover div.background {
		filter: blur(2px);
	}
	button:hover {
		transform: translateY(-5px);
		box-shadow: 0px 10px 8px rgba(0, 0, 0, 0.3);
	}
</style>
