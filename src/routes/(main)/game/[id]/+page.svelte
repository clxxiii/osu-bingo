<script lang="ts">
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';
	import { game as store, square, listener, login_request, game_rules } from '$lib/stores';
	import LoginRequest from '$lib/components/LoginRequest.svelte';
	import { fade } from 'svelte/transition';
	import InterfaceGrids from '$lib/components/InterfaceGrids.svelte';
	import TeamList from '$lib/components/TeamList.svelte';
	import BingoCard from '$lib/components/BingoCard.svelte';
	import SquareSidebar from '$lib/components/SquareSidebar.svelte';
	import Chatbox from '$lib/components/Chatbox.svelte';
	import EventList from '$lib/components/EventList.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import HostSettings from '$lib/components/HostSettings.svelte';
	import WinConfetti from '$lib/components/WinConfetti.svelte';
	import PageContainer from '$lib/components/PageContainer.svelte';
	import { getRules } from '$lib/gamerules/get_rules';

	export let data: PageData;

	let currentTeam: string | undefined;
	let winner: string | null = null;
	let host: boolean = false;
	store.subscribe((game) => {
		if (!game) return;
		winner = game.winning_team;
		currentTeam = game.users.find((x) => x.user_id == data?.user?.id)?.team_name;
		host = game.hosts.find((x) => x.id == data?.user?.id) != undefined;

		game_rules.set(getRules(game));
	});

	$: {
		if (currentTeam) {
			fetch(`/game_stream/change_channel?id=${$listener}&channel=${currentTeam}`, {
				method: 'POST'
			});
		}
	}

	// Recieve Game updates from server
	onMount(() => {
		if (data.game_id) {
			if ($listener) {
				fetch(`/game_stream/change_game?id=${$listener}&game_id=${data.game_id}`, {
					method: 'POST'
				});
			}
		}
	});

	onDestroy(() => {
		if ($listener) {
			fetch(`/game_stream/change_game?id=${$listener}`, { method: 'POST' });
		}
		store.set(null);
		square.set(null);
	});
</script>

<svelte:head>
	{#if data.game_id && $store?.public}
		<title>
			Bingo Game: {$store.link_id}
		</title>

		<meta property="twitter:card" content="summary" />
		<meta property="og:title" content="osu!Bingo: Game {$store.link_id}" />
		<meta property="og:type" content="website" />
		<meta property="og:description" content="A public osu! bingo game!" />
		<meta property="og:url" content="https://osu.bingo/{$store.link_id}" />
		<meta property="og:image" content="https://osu.bingo/icon.svg" />
	{:else if data.game_id && !$store?.public}
		<title>Private Game</title>
	{:else}
		<title>Loading Game...</title>
	{/if}
</svelte:head>

<PageContainer>
	<div class="grid">
		{#if $store}
			<InterfaceGrids {host} state={$store.state}>
				<article slot="player-list" class="grid h-full grid-rows-2 gap-y-2 bg-zinc-900">
					<div class="h-full w-full">
						<TeamList
							invited={data.invited}
							team="BLUE"
							gameStore={store}
							host={data.is_host}
							user={data.user}
						/>
					</div>
					<div class="h-full w-full">
						<TeamList
							invited={data.invited}
							team="RED"
							gameStore={store}
							host={data.is_host}
							user={data.user}
						/>
					</div>
				</article>

				<article slot="board" class="grid aspect-square">
					<BingoCard {store} {host} />
				</article>

				<article slot="square-sidebar" class="size-full">
					<SquareSidebar gameStore={store} tiebreaker={$game_rules?.reclaim_condition ?? 'score'} />
				</article>

				<article slot="chat" class="size-full">
					<Chatbox
						channel={$store.state == 1 ? currentTeam?.toLowerCase() : 'global'}
						enabled={currentTeam != undefined || data.is_host}
					/>
				</article>
				<article class="size-full bg-zinc-800 p-2" slot="event-list">
					<EventList />
				</article>
				<article class="size-full" slot="host-settings">
					<HostSettings />
				</article>
			</InterfaceGrids>
		{:else}
			<div
				in:fade={{ delay: 500, duration: 0 }}
				out:fade={{ duration: 200 }}
				class="col-start-1 col-end-2 row-start-1 row-end-2 mt-10 flex w-full flex-col items-center font-rounded text-lg"
			>
				<LoadingIcon size={75} />
				<div class="mt-4">LOADING GAME</div>
			</div>
		{/if}
		{#if winner}
			<WinConfetti team={winner} />
		{/if}

		{#if !$listener}
			<div
				transition:fade
				class="fixed left-0 top-0 z-30 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-md"
			>
				You lost connection to the game, attempting to reconnect.
				<br />
				If waiting doesn't do anything, a refresh might fix it!
			</div>
		{/if}
		{#if $login_request}
			<div
				transition:fade
				class="fixed left-0 top-12 z-30 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-md"
			>
				<LoginRequest />
			</div>
		{/if}
	</div>
</PageContainer>
