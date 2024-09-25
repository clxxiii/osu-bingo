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

<div class="h-full w-[250px] rounded-lg bg-zinc-900/50 p-2">
	{#if event}
		<div class="flex w-full justify-between">
			<h2>Next Event:</h2>
			<div class="flex items-center gap-x-1">
				<Timer time={event.time} clock={true} />
			</div>
		</div>
		<hr class="my-1 border-zinc-700/50" />
		<span class="col-start-1 col-end-3 row-start-2 row-end-3 text-zinc-400">{eventMeaning}</span>
	{:else}
		There are no upcoming events. The game will end when a team gets a win, Good Luck!
	{/if}
</div>
