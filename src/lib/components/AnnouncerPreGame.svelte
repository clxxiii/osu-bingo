<script lang="ts">
	import type { Writable } from 'svelte/store';
	import AnnouncerTeam from './AnnouncerTeam.svelte';
	import AnnouncerInvite from './AnnouncerInvite.svelte';

	export let gameStore: Writable<Bingo.Card | null>;
	export let user: Bingo.User | undefined;
	export let isHost: boolean;
	export let currentTeam: string | undefined;

	const start = async () => {
		const data = new FormData();
		await fetch(`?/start_game`, {
			body: data,
			method: 'POST'
		});
	};
</script>

<div class="flex h-full items-center justify-between p-2">
	<AnnouncerTeam {currentTeam} buttons={true} {user} />
	<div>
		Waiting for the host to start the game!
		{#if isHost}
			<button on:click={start} class="rounded-full bg-green-600 p-1 px-2 text-sm"> START</button>
		{/if}
	</div>
	{#if $gameStore}
		<AnnouncerInvite linkCode={$gameStore.link_id} hidden={!$gameStore.public} />
	{/if}
</div>
