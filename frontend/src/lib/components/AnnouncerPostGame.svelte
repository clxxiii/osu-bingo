<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let gameStore: Writable<Bingo.Card | null>;
</script>

<div class="mb-2">
	<div
		data-team={$gameStore?.winning_team?.toUpperCase()}
		class="flex h-full w-full items-center justify-center rounded-lg py-1 font-rounded text-xl font-bold uppercase data-[team=BLUE]:bg-blue-700 data-[team=RED]:bg-amber-700"
	>
		{#if $gameStore?.winning_team}
			{$gameStore?.winning_team.toLowerCase()} team won the game
		{/if}
	</div>
</div>
