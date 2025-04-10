<script lang="ts">
	import GameListItem from '$lib/components/GameListItem.svelte';
	import MainPageSection from '$lib/components/MainPageSection.svelte';
	import type { PageData } from './$types';
	import PageContainer from '$lib/components/PageContainer.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>osu!Bingo</title>

	<meta property="twitter:card" content="summary" />
	<meta property="og:title" content="osu!Bingo" />
	<meta property="og:type" content="website" />
	<meta
		property="og:description"
		content="A team vs team battle to claim squares on a bingo board, all while playing your favorite circle clicking game."
	/>
	<meta property="og:url" content="https://osu.bingo" />
	<meta property="og:image" content="https://osu.bingo/icon.svg" />
</svelte:head>

<PageContainer>
	<div class="flex h-[300px] items-center justify-center">
		<h1 class="font-display text-[96px]">osu!Bingo</h1>
	</div>
	<div class="m-auto mt-10 flex w-full max-w-[1200px] flex-col gap-10 lg:flex-row">
		<div>
			<h1 class="text-3xl">Welcome to osu! Bingo!</h1>
			<hr class="my-2 border-zinc-700" />
			<MainPageSection title="How it Works">
				osu! Bingo is just like regular Bingo, but with a twist. Two teams of up to 50 players
				compete to try and fill in any horizontal, vertical, or diagonal line on a Bingo Board.
			</MainPageSection>

			<MainPageSection title="Claim a square">
				In public games, squares start off by requiring an FC. Over the course of the game, the
				requirement goes down, from just needing an A rank, to any pass working as a claim.
			</MainPageSection>

			<MainPageSection title="No square is safe!">
				Even if a team claims a square, the other team can <b>reclaim</b> that square by getting a high
				score on the map that also meets the claim condition.
			</MainPageSection>

			<MainPageSection title="Play Anywhere">
				Games support submitting scores from <b>both</b> osu!stable <b>and</b> osu!lazer. Play wherever
				you're most comfortable!
			</MainPageSection>

			<MainPageSection title="Play with Friends">
				Host a lobby privately with friends, where only those you send the invite code to can join,
				or host a public lobby open to anybody who desires!
			</MainPageSection>

			<MainPageSection title="Play it your way">
				The settings for the game are infinitely customizable. Change the claim conditions, edit the
				claim change timings or remove them all together. Change reclaim conditions, set your own
				custom board, or pick from a map pool, or make your own custom shaped board all together.
			</MainPageSection>

			<MainPageSection title="Stream-friendly">
				If you're streaming, you can keep your viewers up-to-date without leaving the stream using
				one of our stream overlays, that will automatically update as the game progresses
			</MainPageSection>
		</div>
		<div class="w-full">
			{#each data.games as game}
				<GameListItem {game} />
			{/each}
			<a class="block w-full text-center uppercase text-zinc-700" href="/games">View All Games</a>
		</div>
	</div>
</PageContainer>
