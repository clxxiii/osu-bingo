<script lang="ts">
	import { fly } from 'svelte/transition';
	import { X } from 'lucide-svelte';
	import MapCard from './MapCard.svelte';
	import { square as store } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import ScoreList from './ScoreList.svelte';

	export let tiebreaker: string;
	export let gameStore: Writable<Bingo.Card | null>;

	let square: Bingo.Card.FullSquare | null = null;
	let sidebar: HTMLDivElement;
	let transition = false;

	store.subscribe(async (index) => {
		if (index == null || $gameStore?.squares == null) {
			square = null;
			return;
		}

		square = $gameStore.squares[index];

		square.scores.sort((a, b) => {
			if (tiebreaker == 'accuracy') return b.accuracy - a.accuracy;
			if (tiebreaker == 'combo') return b.max_combo - a.max_combo;
			if (tiebreaker == 'pp') return (b.pp ?? 0) - (a.pp ?? 0);
			return b.score - a.score;
		});
		square.scores.sort((a, b) => (b.claimworthy ? 1 : 0) - (a.claimworthy ? 1 : 0));
		transition = !transition;
	});
	gameStore.subscribe((value) => {
		if (!value) return;

		const newSquare = value.squares?.find((x) => x.id == square?.id);
		if (newSquare) {
			square = newSquare;

			square.scores.sort((a, b) => {
				if (tiebreaker == 'accuracy') return b.accuracy - a.accuracy;
				if (tiebreaker == 'combo') return b.max_combo - a.max_combo;
				if (tiebreaker == 'pp') return (b.pp ?? 0) - (a.pp ?? 0);
				return b.score - a.score;
			});
			square.scores.sort((a, b) => (b.claimworthy ? 1 : 0) - (a.claimworthy ? 1 : 0));
		}
	});
	const close = () => {
		$store = null;
	};
</script>

{#if square != null}
	<div
		bind:this={sidebar}
		class="group/sidebar relative size-full overflow-hidden rounded-xl bg-zinc-800 transition"
		data-claimer={square.claimed_by?.team_name ?? 'UNCLAIMED'}
	>
		<div
			class="absolute top-0 flex h-14 w-full items-center bg-gradient-to-b to-zinc-800 p-2 font-rounded text-xl transition group-data-[claimer=BLUE]/sidebar:from-blue-600 group-data-[claimer=RED]/sidebar:from-amber-600 group-data-[claimer=UNCLAIMED]/sidebar:from-zinc-600"
		>
			<button
				on:click={close}
				class="flex size-10 items-center justify-center rounded p-1 hover:bg-[rgba(0,0,0,0.5)]"
			>
				<X />
			</button>
			Back to team chat
		</div>

		<!-- This looks stupid, but is necessary for the transition to look the way it does -->
		{#if transition}
			<div in:fly={{ x: 100, duration: 300 }} out:fly={{ x: -100, duration: 150 }}>
				<div class="absolute top-14 w-full">
					<MapCard map={square.data} />
				</div>

				<ScoreList scores={square.scores} {tiebreaker} />
			</div>
		{:else}
			<div in:fly={{ x: 100, duration: 300 }} out:fly={{ x: -100, duration: 150 }}>
				<div class="absolute top-14 w-full">
					<MapCard map={square.data} />
				</div>

				<ScoreList scores={square.scores} {tiebreaker} />
			</div>
		{/if}
	</div>
{/if}
