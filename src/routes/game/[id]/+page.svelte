<script lang="ts">
	import Announcer from '$lib/components/Announcer.svelte';
	import BingoCard from '$lib/components/BingoCard.svelte';
	import Chatbox from '$lib/components/Chatbox.svelte';
	import SquareSidebar from '$lib/components/SquareSidebar.svelte';
	import TeamList from '$lib/components/TeamList.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import type { EmitterEvent } from '$lib/server/game/emitter';
	import { updateGame } from './updater';

	export let data: PageData;

	let sidebar = false;
	let selectedSquare: Bingo.Card.FullSquare | null;

	const store = writable<Bingo.Card>(data.game);

	let currentTeam: string | undefined;
	store.subscribe((game) => {
		if (!game) return;

		currentTeam = game.users.find((x) => x.user_id == data?.user?.id)?.team_name;
	});

	// Show sidebar on bingo square click
	const squareclick = (square: CustomEvent<Bingo.Card.FullSquare>) => {
		if (!sidebar) {
			selectedSquare = square.detail;
			sidebar = true;
			return;
		}
		selectedSquare = null;
		setTimeout(() => (selectedSquare = square.detail), 300);
	};

	// Recieve Game updates from server
	onMount(async () => {
		const gameStream = new EventSource(`/game_stream/${data.game.id}`);
		gameStream.onmessage = (msg) => {
			const event: EmitterEvent = JSON.parse(msg.data);
			console.log(event);
			store.update((current) => updateGame(current, event));
		};
		gameStream.onerror = console.log;
	});
</script>

<section class="grid">
	<article
		class="row-start-1 flex flex-col items-center rounded-xl p-4 gap-y-2 row-end-2 col-start-1 col-end-2 bg-[rgba(0,0,0,0.5)]"
	>
		<Announcer gameStore={store} user={data.user} />
		{#if $store.squares}
			<BingoCard on:squareclick={squareclick} {store} />
		{:else}
			<TeamList gameStore={store} />
		{/if}
	</article>
	<article class=" w-[500px] pl-4 relative row-start-1 row-end-3 col-start-2 col-end-3">
		<Chatbox {store} channel={$store.state == 1 ? currentTeam?.toLowerCase() : 'global'} />
	</article>
	{#if sidebar}
		<article class="pl-4 relative row-start-1 row-end-3 col-start-3 col-end-4">
			<SquareSidebar
				tiebreaker={data.game.tiebreaker}
				on:close={() => (sidebar = false)}
				square={selectedSquare}
			/>
		</article>
	{/if}
</section>

<style>
	section.grid {
		/* screen height - heading - padding */
		height: calc(100vh - 3rem - 2rem);
		max-width: calc(100vw - 2rem);
		grid-template-columns: 2fr fit-content(500px) fit-content(500px);
		grid-template-rows: 1fr;
	}
</style>
