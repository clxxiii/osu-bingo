<script lang="ts">
	import GameListItem from '$lib/components/GameListItem.svelte';
	import { Plus } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { promise } from '$lib/toast';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import PageContainer from '$lib/components/PageContainer.svelte';

	export let data: PageData;

	const newGame = () => {
		const p: Promise<Bingo.BingoGame> = new Promise((resolve, reject) => {
			fetch('/games/new')
				.then((response) => {
					if (response.ok) {
						response.json().then((g: Bingo.BingoGame) => {
							resolve(g);
						});
					}

					response.json().then((e) => reject(e.message));
				})
				.catch(reject);
		});

		// Toast Notification
		promise(p, {
			progress: 'Making Game...',
			success: 'Game Created!'
		});

		p.then((response) => {
			console.log(response);

			// Create a link element and click it (for svelte to transition properly);
			if (browser) {
				setTimeout(() => goto(`/game/${response.id.substring(4)}`), 1000);
			}
		}).catch(console.log);
	};
</script>

<svelte:head>
	<title>Bingo Game List</title>
</svelte:head>

<PageContainer>
	<div class="m-auto mt-10 w-full max-w-[700px]">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl">Public Game List</h1>
				Join a public game, or create your own!
			</div>
			<button
				on:click={newGame}
				class="m-2 flex cursor-pointer rounded bg-green-500 px-2 py-1 font-rounded font-bold text-zinc-200 transition hover:bg-green-600 active:bg-green-700 disabled:cursor-default disabled:bg-green-400 disabled:brightness-50"
				disabled={!data.user}
			>
				<Plus />
				New
			</button>
		</div>
		<hr class="my-2 border-zinc-700" />
		<div class="w-full">
			{#each data.games as game}
				<GameListItem {game} />
			{/each}
		</div>
	</div>
</PageContainer>
