<script lang="ts">
	import type { Writable } from 'svelte/store';
	import EventScore from './EventScore.svelte';

	type ScoreInfo = {
		score: Bingo.Card.FullScore;
		square: Bingo.Card.FullSquare;
		square_index: number;
	};
	export let store: Writable<Bingo.Card | null>;

	let scores: ScoreInfo[] = [];
	store.subscribe((card) => {
		if (!card || !card.squares) return;
		scores = [];

		for (let i = 0; i < card.squares.length; i++) {
			const square = card.squares[i];
			for (const score of square.scores) {
				scores.push({
					score,
					square,
					square_index: i
				});
			}
		}

		scores.sort((a, b) => new Date(b.score.date).valueOf() - new Date(a.score.date).valueOf());
	});
</script>

<div class="size-full overflow-y-scroll">
	{#each scores as score}
		<div class="relative mb-2 w-full">
			<EventScore
				score={score.score}
				square={score.square}
				square_index={score.square_index}
				stat={$store?.tiebreaker ?? ''}
			/>
		</div>
	{/each}
</div>
