<script lang="ts">
	import { game } from '$lib/stores';
	import MinimalCard from '../SimpleCard.svelte';

	export let settings: Settings;

	type Settings = {
		scale: number;
		show_rules: boolean;
	};
</script>

<div
	class="size-full rounded-xl bg-base-800/50 font-rounded text-white"
	style="scale: {settings.scale}"
>
	{#if $game}
		{#if $game.state == 0}
			{#if $game.public}
				<div class="flex justify-center">
					Game {$game.link_id}
				</div>
			{:else}
				Private Game
			{/if}
		{:else}
			<MinimalCard cardStore={game} />
		{/if}
	{/if}
</div>
