<script lang="ts">
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';
	import { game as store, listener, login_request } from '$lib/stores';
	import GameInterface from '$lib/components/GameInterface.svelte';
	import LoginRequest from '$lib/components/LoginRequest.svelte';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	let currentTeam: string | undefined;
	let winner: string | null = null;
	store.subscribe((game) => {
		if (!game) return;
		winner = game.winning_team;
		currentTeam = game.users.find((x) => x.user_id == data?.user?.id)?.team_name;
	});

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
	});
</script>

<svelte:head>
	{#if data.game_id && $store?.public}
		<title>
			Bingo Game: {$store.link_id}
		</title>
	{:else}
		<title>Private Game</title>
	{/if}
</svelte:head>

<GameInterface
	enabled={(data.game_id ?? null) != null}
	user={data.user}
	is_host={data.is_host}
	{currentTeam}
	{winner}
/>
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
