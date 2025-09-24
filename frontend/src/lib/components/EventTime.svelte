<script lang="ts">
	import { getEventMeaning } from '$lib/gamerules/meaning';
	import type { Options } from '$lib/gamerules/options';
	import { Clock } from 'lucide-svelte';

	export let event: Options.Event;

	let eventMeaning = getEventMeaning(event);
</script>

<div class="flex size-full h-8 items-center rounded bg-pink-400/50 p-2">
	<div class="mr-1 flex size-5 h-full items-center opacity-50">
		<Clock />
	</div>
	{eventMeaning}
</div>
