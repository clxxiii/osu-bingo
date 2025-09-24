<script lang="ts">
	export let sort: string;
	export let score: Bingo.Card.FullScore;
	export let stat: 'score' | 'accuracy' | 'combo' | 'pp';
</script>

<div
	data-important={sort == stat}
	class="row-start-2 flex h-full text-xs data-[important=true]:col-start-1 data-[important=true]:col-end-4 data-[important=true]:row-start-1 data-[important=true]:justify-end data-[important=true]:font-rounded data-[important=true]:text-xl data-[important=true]:font-bold"
>
	{#if stat == 'score'}
		{score.score.toLocaleString()}
	{:else if stat == 'accuracy'}
		{(score.accuracy * 100).toFixed(2)}%
	{:else if stat == 'combo'}
		{score.max_combo.toLocaleString()}x
	{:else if stat == 'pp'}
		{Math.round(score.pp ?? 0).toLocaleString()}pp
	{/if}
</div>
