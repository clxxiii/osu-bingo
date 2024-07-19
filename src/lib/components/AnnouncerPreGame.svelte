<script lang="ts">
	import type { Writable } from 'svelte/store';
	import AnnouncerTeam from './AnnouncerTeam.svelte';
	import AnnouncerInvite from './AnnouncerInvite.svelte';

	export let gameStore: Writable<Bingo.Card>;
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

<div class="flex justify-between p-2 items-center h-full">
	<AnnouncerTeam {currentTeam} buttons={true} {user} />
	<div>
		Waiting for the host to start the game!
		{#if isHost}
			<button on:click={start} class="bg-green-600 p-1 rounded-full text-sm px-2"> START</button>
		{/if}
	</div>
	<AnnouncerInvite linkCode={$gameStore.link_id} hidden={!$gameStore.public} />
</div>
