<script lang="ts">
	import { fade, slide, blur } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { X } from 'lucide-svelte';
	import MapCard from './MapCard.svelte';
	import ScoreListItem from './ScoreListItem.svelte';
	export let square: Bingo.Card.FullSquare | null;
	export let tiebreaker: string;

	let sidebar: HTMLDivElement;

	const dispatch = createEventDispatcher();
	$: if (square) {
		square.scores.sort((a, b) => {
			if (tiebreaker == 'accuracy') return b.accuracy - a.accuracy;
			if (tiebreaker == 'combo') return b.max_combo - a.max_combo;
			if (tiebreaker == 'pp') return (b.pp ?? 0) - (a.pp ?? 0);
			return b.score - a.score;
		});
		square.scores.sort((a, b) => (b.important ? 1 : 0) - (a.important ? 1 : 0));
	}
	const close = () => {
		dispatch('close');
	};
</script>

<div
	transition:slide={{ axis: 'x' }}
	bind:this={sidebar}
	class="group bg-zinc-800 overflow-hidden relative w-[500px] transition rounded-xl size-full"
	data-claimer={square?.claimed_by?.team_name ?? 'UNCLAIMED'}
>
	{#if square}
		<div
			transition:fade={{ duration: 150 }}
			class="absolute transition h-14 top-0 w-full p-2 bg-gradient-to-b group-data-[claimer=RED]:from-amber-600 group-data-[claimer=UNCLAIMED]:from-zinc-600 group-data-[claimer=BLUE]:from-blue-600 to-zinc-800"
		>
			<button
				on:click={close}
				class="p-1 flex justify-center items-center rounded size-10 hover:bg-[rgba(0,0,0,0.5)]"
			>
				<X />
			</button>
		</div>

		<div transition:blur={{ duration: 150 }} class="absolute top-14 w-full">
			<MapCard map={square.data} />
		</div>

		<div class="w-full absolute top-56 p-2 pt-4">
			<h2 class="text-xl font-bold font-rounded">Scores</h2>
			<hr class="border-zinc-600 mb-2" />
			{#each square.scores as score, index}
				<ScoreListItem {score} {index} sort={tiebreaker} />
			{/each}
		</div>
	{/if}
</div>
