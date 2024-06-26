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
	<div class="w-full py-1 px-2">
		<div
			data-team={score.score.user.team_name.toLowerCase()}
			class="w-full flex flex-col gap-y-2 p-2 rounded data-[team=red]:bg-amber-700 data-[team=blue]:bg-blue-700"
		>
			<div class="flex gap-x-1">
				<img src={score.score.user.user.avatar_url} class="h-6 rounded-full" alt="" />
				{score.score.user.user.username} has claimed a square for {score.score.user.team_name.toLowerCase()}
				team!
			</div>
			<button
				on:click={click}
				class="w-full z-0 text-left relative flex gap-x-1 bg-zinc-800 rounded overflow-hidden h-14"
			>
				<img src={score.square.data.square_url} class="size-14" alt="" />
				<div class="font-rounded flex flex-col justify-center">
					<div class="font-black">{score.square.data.title}</div>
					<div>by {score.square.data.artist}</div>
				</div>
			</button>
		</div>
	</div>
{:else}
	<div class="italic w-full pl-2 text-zinc-500">
		{score.score.user.user.username} set a new score on {score.square.data.artist} - {score.square
			.data.title}: ({score.score.score.toLocaleString()})
	</div>
{/if}
