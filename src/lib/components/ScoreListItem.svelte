<script lang="ts">
	import ScoreGrade from './ScoreGrade.svelte';

	export let score: Bingo.Card.FullScore;
	export let index: number;
	export let sort: string;
</script>

<div
	data-claimer={score.important ? score.user.team_name : ''}
	class="flex justify-between data-[claimer=RED]:bg-amber-600 data-[claimer=BLUE]:bg-blue-600 hover:shadow-lg mb-2 w-full p-2 h-14 hover:bg-zinc-700 transition rounded"
>
	<div class="flex">
		<span class="font-rounded flex items-center w-3 mr-2 justify-center">{index + 1}</span>
		<div class="grid gap-x-1">
			<img
				class="row-start-1 row-end-3 col-start-1 col-end-2 h-10 rounded-full"
				src={score.user.user.avatar_url}
				alt=""
			/>
			<div class="text-l text-left col-start-2 col-end-3 row-start-1 row-end 2">
				{score.user.user.username}
			</div>
			<div class="text-xs text-left col-start-2 col-end-3 row-start-2 row-end-3">
				#{score.user.user.global_rank?.toLocaleString()}
			</div>
		</div>
	</div>
	<div class="flex gap-x-2 items-center">
		{#if score.mods != ''}
			<div>+{score.mods}</div>
		{/if}
		<div class="text-2xl font-rounded font-bold">
			{#if sort == 'score'}
				{score.score.toLocaleString()}
			{:else if sort == 'accuracy'}
				{(score.accuracy * 100).toFixed(2)}%
			{:else if sort == 'combo'}
				{score.max_combo.toLocaleString()}x
			{:else if sort == 'pp'}
				{Math.round(score.pp ?? 0).toLocaleString()}pp
			{/if}
		</div>
		<ScoreGrade grade={score.grade} />
	</div>
</div>
<!-- {JSON.stringify(score)} -->
