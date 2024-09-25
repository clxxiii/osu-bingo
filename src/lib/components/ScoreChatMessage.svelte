<script lang="ts">
	import { square } from '$lib/stores';
	export let score: {
		score: Bingo.Card.FullScore;
		square: Bingo.Card.FullSquare;
		claim: boolean;
	};

	score.square.scores.push(score.score);
	const click = () => {
		$square = score.square;
	};
</script>

<!-- {JSON.stringify(event)} -->

{#if score.claim}
	<div class="w-full px-2 py-1">
		<div
			data-team={score.score.user.team_name.toLowerCase()}
			class="flex w-full flex-col gap-y-2 rounded p-2 data-[team=blue]:bg-blue-700 data-[team=red]:bg-amber-700"
		>
			<div class="flex gap-x-1">
				<img src={score.score.user.user.avatar_url} class="h-6 rounded-full" alt="" />
				{score.score.user.user.username} has claimed a square for {score.score.user.team_name.toLowerCase()}
				team!
			</div>
			<button
				on:click={click}
				class="relative z-0 flex h-14 w-full gap-x-1 overflow-hidden rounded bg-zinc-800 text-left"
			>
				<img src={score.square.data.square_url} class="size-14" alt="" />
				<div class="flex flex-col justify-center font-rounded">
					<div class="font-black">{score.square.data.title}</div>
					<div>by {score.square.data.artist}</div>
				</div>
			</button>
		</div>
	</div>
{:else}
	<div class="w-full pl-2 italic text-zinc-500">
		{score.score.user.user.username} set a new score on {score.square.data.artist} - {score.square
			.data.title}: ({score.score.score.toLocaleString()})
	</div>
{/if}
