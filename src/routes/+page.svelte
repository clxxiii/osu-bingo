<script lang="ts">
	import GameListItem from '$lib/components/GameListItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>osu!Bingo</title>
</svelte:head>

<div class="pattern h-[300px]"></div>
<div class="m-auto mt-10 w-full max-w-[600px]">
	<h1 class="text-3xl">Welcome to osu! Bingo!</h1>
	Join a public game, or create your own!
	<hr class="border-zinc-700 my-2" />
	<div class="w-full">
		{#each data.games as game}
			<GameListItem {game} />
		{/each}
	</div>
</div>

<style>
	.pattern {
		background-color: #18181b;
		background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233f3f46' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
	}
</style>
