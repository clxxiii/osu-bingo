<script lang="ts">
	import { type Writable } from 'svelte/store';
	import AnnouncerPreGame from './AnnouncerPreGame.svelte';
	import AnnouncerPostGame from './AnnouncerPostGame.svelte';
	import AnnouncerGame from './AnnouncerGame.svelte';

	export let gameStore: Writable<Bingo.Card | null>;
	export let user: Bingo.User | undefined;
	export let isHost: boolean;
	export let currentTeam: string | undefined;
</script>

<div class="mb-4 size-full h-32 rounded-xl bg-zinc-800 font-rounded font-bold">
	{#if $gameStore && $gameStore.state == 0}
		<AnnouncerPreGame {gameStore} {user} {isHost} {currentTeam} />
	{:else if $gameStore && $gameStore.state == 1}
		<AnnouncerGame {gameStore} {currentTeam} {user} />
	{:else if $gameStore && $gameStore.state == 2}
		<AnnouncerPostGame {gameStore} />
	{/if}
</div>
