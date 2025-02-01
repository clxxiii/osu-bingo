<script lang="ts">
	import type { Writable } from 'svelte/store';
	import EventScore from './EventScore.svelte';
	import { fly } from 'svelte/transition';

	type ScoreInfo = {
		score: Bingo.Card.FullScore;
		square: Bingo.Card.FullSquare;
		square_index: number;
	};
	export let store: Writable<Bingo.Card | null>;

	let scores: ScoreInfo[] = [];
	store.subscribe((card) => {
		if (!card || !card.squares) return;

		const score_id_map = scores.map((x) => x.score.id);

		for (let i = 0; i < card.squares.length; i++) {
			const square = card.squares[i];
			for (const score of square.scores) {
				if (score_id_map.includes(score.id)) continue;

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
		<div class="relative mb-2 w-full" transition:fly={{ x: 30, duration: 1000 }}>
			<EventScore
				score={score.score}
				square={score.square}
				square_index={score.square_index}
				stat={$store?.tiebreaker ?? ''}
			/>
		</div>
	{/each}
</div>
