<script lang="ts">
	import type { Writable } from 'svelte/store';
	import ScoreListItem from './ScoreListItem.svelte';

	export let store: Writable<Bingo.Card | null>;

	let scores: Bingo.Card.FullScore[] = [];
	store.subscribe((card) => {
		if (!card || !card.squares) return;
		scores = [];

		for (const square of card.squares) {
			for (const score of square.scores) {
				scores.push(score);
			}
		}

		scores.sort((a, b) => a.date.valueOf() - b.date.valueOf());
	});
</script>

<div class="size-full overflow-y-scroll">
	{#each scores as score}
		<div class="relative mb-2 w-full rounded bg-zinc-700">
			{#if score.grade != 'F'}
				<ScoreListItem {score} sort={$store?.tiebreaker ?? 'score'} />
			{/if}
		</div>
	{/each}
</div>
