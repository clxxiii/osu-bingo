<script lang="ts">
	export let score: {
		score: Bingo.Card.FullScore;
		map: Bingo.Card.FullMap;
		claim: boolean;
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
			<div class="w-full relative flex gap-x-1 bg-zinc-800 rounded overflow-hidden h-14">
				<img src={score.map.square_url} class="size-14" alt="" />
				<div class="font-rounded flex flex-col justify-center">
					<div class="font-black">{score.map.title}</div>
					<div>by {score.map.artist}</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="italic w-full pl-2 text-zinc-500">
		{score.score.user.user.username} set a new score on {score.map.artist} - {score.map.title}: ({score.score.score.toLocaleString()})
	</div>
{/if}
