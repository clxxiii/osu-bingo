<script lang="ts">
	import { game } from '$lib/stores';

	export let settings: Settings;

	type Settings = {
		scale: number;
		show_rules: boolean;
	};
</script>

<div class="size-full rounded-xl bg-base-800/50 font-rounded text-white">
	{#if $game}
		{#if $game.state == 0}
			{#if $game.public}
				<div class="flex justify-center">
					Game {$game.link_id}
				</div>
			{:else}
				Private Game
			{/if}
		{:else if $game.state == 1}
			Game has started!
		{:else}
			Game has ended
		{/if}
	{/if}
</div>
{JSON.stringify($game)}
