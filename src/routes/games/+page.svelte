<script lang="ts">
	import GameListItem from '$lib/components/GameListItem.svelte';
	import { Plus } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Bingo Game List</title>
</svelte:head>

<div class="m-auto mt-10 w-full max-w-[700px]">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl">Public Game List</h1>
			Join a public game, or create your own!
		</div>
		<a
			href="/games/new"
			class="flex m-2 px-2 py-1 rounded transition bg-green-500 hover:bg-green-600 active:bg-green-700 text-zinc-200 font-bold font-rounded"
		>
			<Plus />
			New
		</a>
	</div>
	<hr class="border-zinc-700 my-2" />
	<div class="w-full">
		{#each data.games as game}
			<GameListItem {game} />
		{/each}
	</div>
</div>
