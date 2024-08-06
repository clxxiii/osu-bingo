<script lang="ts">
	import { fly } from 'svelte/transition';
	import { X } from 'lucide-svelte';
	import MapCard from './MapCard.svelte';
	import { square as store } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import ScoreList from './ScoreList.svelte';

	export let tiebreaker: string;
	export let gameStore: Writable<Bingo.Card>;

	let square: Bingo.Card.FullSquare | null = null;
	let sidebar: HTMLDivElement;
	let transition = false;

	store.subscribe(async (index) => {
		if (index == null || $gameStore.squares == null) {
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
		square.scores.sort((a, b) => (b.important ? 1 : 0) - (a.important ? 1 : 0));
		transition = !transition;
	});
	gameStore.subscribe((value) => {
		const newSquare = value.squares?.find((x) => x.id == square?.id);
		if (newSquare) {
			square = newSquare;

			square.scores.sort((a, b) => {
				if (tiebreaker == 'accuracy') return b.accuracy - a.accuracy;
				if (tiebreaker == 'combo') return b.max_combo - a.max_combo;
				if (tiebreaker == 'pp') return (b.pp ?? 0) - (a.pp ?? 0);
				return b.score - a.score;
			});
			square.scores.sort((a, b) => (b.important ? 1 : 0) - (a.important ? 1 : 0));
		}
	});
	const close = () => {
		$store = null;
	};
</script>

{#if square != null}
	<div
		bind:this={sidebar}
		class="group bg-zinc-800 overflow-hidden relative transition rounded-xl size-full"
		data-claimer={square.claimed_by?.team_name ?? 'UNCLAIMED'}
	>
		<div
			class="absolute flex items-center font-rounded text-xl transition h-14 top-0 w-full p-2 bg-gradient-to-b group-data-[claimer=RED]:from-amber-600 group-data-[claimer=UNCLAIMED]:from-zinc-600 group-data-[claimer=BLUE]:from-blue-600 to-zinc-800"
		>
			<button
				on:click={close}
				class="p-1 flex justify-center items-center rounded size-10 hover:bg-[rgba(0,0,0,0.5)]"
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
