<script lang="ts">
	import Announcer from '$lib/components/Announcer.svelte';
	import BingoCard from '$lib/components/BingoCard.svelte';
	import Chatbox from '$lib/components/Chatbox.svelte';
	import SquareSidebar from '$lib/components/SquareSidebar.svelte';
	import TeamList from '$lib/components/TeamList.svelte';
	import HostSettings from '$lib/components/HostSettings.svelte';
	import WinConfetti from '$lib/components/WinConfetti.svelte';

	import { square, game as store } from '$lib/stores';
	export let hostSettingsOpen = true;
	import { fade } from 'svelte/transition';
	import { Settings, X } from 'lucide-svelte';

	export let enabled: boolean;
	export let is_host: boolean;
	export let currentTeam: string | undefined;
	export let user: Bingo.User | undefined;
	export let winner: string | null;
</script>

{#if enabled}
	{#if $store}
		<section class="grid">
			<article class="col-start-1 col-end-2 row-start-1 row-end-2">
				<Announcer {currentTeam} gameStore={store} {user} isHost={is_host} />
			</article>
			<article
				class="relative col-start-1 col-end-2 row-start-2 row-end-3 flex items-center justify-center gap-x-4 gap-y-2 rounded-xl bg-[rgba(0,0,0,0.5)] p-4"
			>
				{#if $store.state == 0}
					<div class="h-[500px] w-[350px]">
						<TeamList team="BLUE" gameStore={store} host={is_host} {user} />
					</div>
				{/if}
				{#if $store.state == 1 || $store.state == 2}
					<BingoCard {store} />
				{/if}
				{#if $store.state == 0}
					<div class="h-[500px] w-[350px]">
						<TeamList team="RED" gameStore={store} host={is_host} {user} />
					</div>
				{/if}
				{#if is_host && $store.state == 0}
					<div class="absolute right-0 top-0 z-10 p-2">
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
			<article class=" relative col-start-2 col-end-3 row-start-1 row-end-3 w-[500px] pl-4">
				{#key currentTeam}
					{#if currentTeam || $store.state == 0 || $store.state == 2}
						<Chatbox
							channel={$store.state == 1 ? currentTeam?.toLowerCase() : 'global'}
							enabled={currentTeam != undefined || is_host}
						/>
					{:else if $store.state == 1}
						<div class="grid h-full grid-rows-2 gap-y-4 rounded-lg bg-zinc-800 p-4">
							<TeamList team="RED" gameStore={store} host={is_host} {user} />
							<TeamList team="BLUE" gameStore={store} host={is_host} {user} />
						</div>
					{/if}
				{/key}
			</article>
			{#if $square != null}
				<article
					transition:fade={{ duration: 150 }}
					class="relative col-start-2 col-end-3 row-start-1 row-end-3 pl-4"
				>
					<SquareSidebar gameStore={store} tiebreaker={$store.tiebreaker} />
				</article>
			{/if}
		</section>

		{#if winner}
			<WinConfetti team={winner} />
		{/if}
	{:else}
		loading game
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
