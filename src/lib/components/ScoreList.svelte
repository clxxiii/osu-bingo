<script lang="ts">
	import ScoreListItem from './ScoreListItem.svelte';

	export let scores: Bingo.Card.FullScore[];
	export let tiebreaker: string = 'score';
</script>

<div class="w-full absolute top-56 p-2 pt-4">
	<h2 class="text-xl font-bold font-rounded">Scores</h2>
	<hr class="border-zinc-600 mb-2" />
	<div class="overflow-y-scroll h-full p-2">
		{#each scores as score, index}
			<ScoreListItem {score} {index} sort={tiebreaker} />
		{/each}
	</div>
</div>
