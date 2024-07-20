<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let gameStore: Writable<Bingo.Card>;
</script>

<div
	data-team={$gameStore.winning_team?.toUpperCase()}
	class="w-full h-full rounded-lg capitalize data-[team=BLUE]bgt-blue-700 data-[team=RED]:bg-amber-700 font-sans text-3xl flex items-center justify-center"
>
	{#if $gameStore.winning_team}
		{$gameStore.winning_team.toLowerCase()} team won the game
	{/if}
</div>
