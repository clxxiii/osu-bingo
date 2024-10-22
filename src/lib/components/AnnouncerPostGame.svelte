<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let gameStore: Writable<Bingo.Card | null>;
</script>

<div
	data-team={$gameStore?.winning_team?.toUpperCase()}
	class="data-[team=BLUE]bgt-blue-700 flex h-full w-full items-center justify-center rounded-lg font-sans text-3xl capitalize data-[team=RED]:bg-amber-700"
>
	{#if $gameStore?.winning_team}
		{$gameStore?.winning_team.toLowerCase()} team won the game
	{/if}
</div>
