<script lang="ts">
	import ScoreGrade from './ScoreGrade.svelte';
	import ScoreListItemStatistic from './ScoreListItemStatistic.svelte';

	export let score: Bingo.Card.FullScore;
	export let index: number;
	export let sort: string;
</script>

{#if score.grade != 'F'}
	<a
		data-claimer={score.important ? score.user.team_name : ''}
		data-pass={score.grade != 'F'}
		target="_blank"
		rel="noopener noreferrer"
		class="flex justify-between data-[pass=false]:opacity-60 group/item data-[claimer=RED]:bg-amber-600 data-[claimer=BLUE]:bg-blue-600 hover:shadow-lg mb-2 w-full p-2 h-14 hover:bg-zinc-700 transition rounded"
		href="https://osu.ppy.sh/scores/{score.score_id}"
	>
		<div class="flex">
			<!-- <span class="font-rounded flex items-center w-3 mr-2 justify-center">{index + 1}</span> -->
			<div class="grid gap-x-1">
				<img
					class="row-start-1 row-end-3 col-start-1 col-end-2 h-10 rounded-full"
					src={score.user.user.avatar_url}
					alt=""
				/>
				<div
					data-user={score.important ? '' : score.user.team_name}
					class="text-l text-left col-start-2 col-end-3 row-start-1 row-end 2 data-[user=RED]:text-amber-600 data-[user=BLUE]:text-blue-600"
				>
					{score.user.user.username}
				</div>
				<div
					data-user={score.important ? '' : score.user.team_name}
					class="text-xs text-left col-start-2 col-end-3 row-start-2 row-end-3 data-[user=RED]:text-amber-200 data-[user=BLUE]:text-blue-200"
				>
					#{score.user.user.global_rank?.toLocaleString()}
				</div>
			</div>
		</div>
		<div class="flex gap-x-2 items-center">
			{#if score.mods != ''}
				<div>+{score.mods}</div>
			{/if}
			<div
				class="h-full grid grid-rows-[repeat(2,_minmax(0,_min-content))] gap-x-1 grid-cols-[repeat(4,_minmax(0,_min-content))]"
			>
				{#if score.grade != 'F'}
					<ScoreListItemStatistic stat="score" {score} {sort} />
					<ScoreListItemStatistic stat="combo" {score} {sort} />
					<ScoreListItemStatistic stat="accuracy" {score} {sort} />
					<ScoreListItemStatistic stat="pp" {score} {sort} />
				{:else}
					{((score.percentage ?? 0) * 100).toFixed(1)}%
				{/if}
			</div>
			<ScoreGrade grade={score.grade} />
		</div>
	</a>
{/if}
