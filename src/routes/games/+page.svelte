<script lang="ts">
	import GameListItem from '$lib/components/GameListItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Bingo Game List</title>
</svelte:head>

<div class="m-auto mt-10 w-full max-w-[700px]">
	<h1 class="text-3xl">Public Game List</h1>
	Join a public game, or create your own!
	<hr class="border-zinc-700 my-2" />
	<div class="w-full">
		{#each data.games as game}
			<GameListItem {game} />
		{/each}
	</div>
</div>
