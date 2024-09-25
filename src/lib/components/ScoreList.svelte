<script lang="ts">
	import ScoreListItem from './ScoreListItem.svelte';

	export let scores: Bingo.Card.FullScore[];
	export let tiebreaker: string = 'score';
</script>

<div class="absolute top-56 w-full p-2 pt-4">
	<h2 class="font-rounded text-xl font-bold">Scores</h2>
	<hr class="mb-2 border-zinc-600" />
	<div class="h-full overflow-y-scroll p-2">
		{#each scores as score, index}
			<ScoreListItem {score} {index} sort={tiebreaker} />
		{/each}
	</div>
</div>
