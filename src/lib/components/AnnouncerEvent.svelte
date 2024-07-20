<script lang="ts">
	import { browser } from '$app/environment';
	import Timer from './Timer.svelte';

	export let event: Bingo.TimeEvent | undefined;

	let eventMeaning: string;
	$: {
		if (event && browser) {
			fetch(`/get_event_meaning?action=${event?.action}`).then((r) =>
				r.text().then((r) => (eventMeaning = r))
			);
		}
	}
</script>

<div class="w-[250px] p-2 bg-zinc-900/50 h-full rounded-lg">
	{#if event}
		<div class="flex justify-between w-full">
			<h2>Next Event:</h2>
			<div class="flex items-center gap-x-1">
				<Timer time={event.time} clock={true} />
			</div>
		</div>
		<hr class="border-zinc-700/50 my-1" />
		<span class="text-zinc-400 row-start-2 row-end-3 col-start-1 col-end-3">{eventMeaning}</span>
	{:else}
		There are no upcoming events. The game will end when a team gets a win, Good Luck!
	{/if}
</div>
