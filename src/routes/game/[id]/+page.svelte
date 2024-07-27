<script lang="ts">
	import Announcer from '$lib/components/Announcer.svelte';
	import BingoCard from '$lib/components/BingoCard.svelte';
	import Chatbox from '$lib/components/Chatbox.svelte';
	import SquareSidebar from '$lib/components/SquareSidebar.svelte';
	import TeamList from '$lib/components/TeamList.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { EmitterEvent } from '$lib/events';
	import { listen, updateGame } from './updater';
	import { square } from '$lib/stores';
	import { fade } from 'svelte/transition';
	import { source } from 'sveltekit-sse';
	import { Settings, X } from 'lucide-svelte';
	import HostSettings from '$lib/components/HostSettings.svelte';
	import WinConfetti from '$lib/components/WinConfetti.svelte';
	import { game as store } from './updater';

	export let data: PageData;
	export let hostSettingsOpen = true;

	if (data.game) store.set(data.game);

	let currentTeam: string | undefined;
	let winner: string | null = null;
	store.subscribe((game) => {
		if (!game) return;
		winner = game.winning_team;
		currentTeam = game.users.find((x) => x.user_id == data?.user?.id)?.team_name;
	});

	if (data.game) listen(data.game.id, currentTeam);

	// Recieve Game updates from server
</script>

<svelte:head>
	{#if data.game && data.game.public}
		<title>
			Bingo Game: {$store.link_id}
		</title>
	{:else}
		<title>Private Game</title>
	{/if}
</svelte:head>

{#if data.game}
	<section class="grid">
		<article class="row-start-1 row-end-2 col-start-1 col-end-2">
			<Announcer {currentTeam} gameStore={store} user={data.user} isHost={data.is_host} />
		</article>
		<article
			class="row-start-2 relative flex gap-x-4 items-center justify-center rounded-xl p-4 gap-y-2 row-end-3 col-start-1 col-end-2 bg-[rgba(0,0,0,0.5)]"
		>
			{#if $store.state == 0}
				<div class="h-[500px] w-[350px]">
					<TeamList team="BLUE" gameStore={store} host={data.is_host} user={data.user} />
				</div>
			{/if}
			{#if $store.state == 1 || $store.state == 2}
				<BingoCard {store} />
			{/if}
			{#if $store.state == 0}
				<div class="h-[500px] w-[350px]">
					<TeamList team="RED" gameStore={store} host={data.is_host} user={data.user} />
				</div>
			{/if}
			{#if data.is_host && $store.state == 0}
				<div class="absolute top-0 right-0 p-2 z-10">
					<button on:click={() => (hostSettingsOpen = !hostSettingsOpen)}>
						{#if hostSettingsOpen}
							<X class="size-8" />
						{:else}
							<Settings class="size-8" />
						{/if}
					</button>
				</div>
				{#if hostSettingsOpen}
					<HostSettings {store} />
				{/if}
			{/if}
		</article>
		<article class=" w-[500px] pl-4 relative row-start-1 row-end-3 col-start-2 col-end-3">
			{#key currentTeam}
				{#if currentTeam || $store.state == 0 || $store.state == 2}
					<Chatbox
						channel={$store.state == 1 ? currentTeam?.toLowerCase() : 'global'}
						enabled={currentTeam != undefined}
					/>
				{:else if $store.state == 1}
					<div class="h-full rounded-lg bg-zinc-800 p-4 gap-y-4 grid grid-rows-2">
						<TeamList team="RED" gameStore={store} host={data.is_host} user={data.user} />
						<TeamList team="BLUE" gameStore={store} host={data.is_host} user={data.user} />
					</div>
				{/if}
			{/key}
		</article>
		{#if $square}
			<article
				transition:fade={{ duration: 150 }}
				class="pl-4 relative row-start-1 row-end-3 col-start-2 col-end-3"
			>
				<SquareSidebar tiebreaker={data.game.tiebreaker} />
			</article>
		{/if}
	</section>

	{#if winner}
		<WinConfetti team={winner} />
	{/if}
{:else}
	You haven't been invited to this private game
{/if}

<style>
	section.grid {
		/* screen height - heading - padding */
		height: calc(100vh - 3rem - 2rem);
		max-width: calc(100vw - 2rem);
		grid-template-columns: 2fr fit-content(500px) fit-content(500px);
		grid-template-rows: fit-content(100px) 1fr;
	}
</style>
