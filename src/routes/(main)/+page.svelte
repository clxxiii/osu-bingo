<script lang="ts">
	import GameListItem from '$lib/components/GameListItem.svelte';
	import MainPageSection from '$lib/components/MainPageSection.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>osu!Bingo</title>
</svelte:head>

<div class="pattern h-[300px]"></div>
<div class="m-auto mt-10 w-full max-w-[800px]">
	<h1 class="text-3xl">Welcome to osu! Bingo!</h1>
	<hr class="my-2 border-zinc-700" />
	<div class="w-full">
		{#each data.games as game}
			<GameListItem {game} />
		{/each}
	</div>
	<MainPageSection title="How it Works">
		osu! Bingo is just like regular Bingo, but with a twist. Two teams of up to 50 players compete
		to try and fill in any horizontal, vertical, or diagonal line on a Bingo Board.
	</MainPageSection>

	<MainPageSection title="Claim a square">
		In public games, squares start off by requiring an FC. Over the course of the game, the
		requirement goes down, from just needing an A rank, to any pass working as a claim.
	</MainPageSection>

	<MainPageSection title="No square is safe!">
		Even if a team claims a square, the other team can **reclaim** that square by getting a high
		score on the map that also meets the claim condition.
	</MainPageSection>

	<MainPageSection title="Play Anywhere">
		Games support submitting scores from <b>both</b> osu!stable <b>and</b> osu!lazer. Play wherever you're
		most comfortable!
	</MainPageSection>

	<MainPageSection title="Play with Friends">
		Host a lobby privately with friends, where only those you send the invite code to can join, or
		host a public lobby open to anybody who desires!
	</MainPageSection>

	<MainPageSection title="Play it your way">
		The settings for the game are infinitely customizable. Change the claim conditions, edit the
		claim change timings or remove them all together. Change reclaim conditions, set your own custom
		board, or pick from a map pool, or make your own custom shaped board all together.
	</MainPageSection>

	<MainPageSection title="Stream-friendly">
		If you're streaming, you can keep your viewers up-to-date without leaving the stream using one
		of our stream overlays, that will automatically update as the game progresses
	</MainPageSection>
</div>

<style>
	.pattern {
		background-color: #18181b;
		background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233f3f46' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
	}
</style>
