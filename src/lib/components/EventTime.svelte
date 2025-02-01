<script lang="ts">
	import { browser } from '$app/environment';
	import { Clock } from 'lucide-svelte';

	export let event: Bingo.TimeEvent;

	let eventMeaning: string;
	if (event && browser) {
		fetch(`/get_event_meaning?action=${event?.action}`).then((r) =>
			r.text().then((r) => (eventMeaning = r))
		);
	}
</script>

<div class="flex size-full rounded bg-pink-400/50 p-2">
	<div class="mr-1 flex size-5 h-full items-center opacity-50">
		<Clock />
	</div>
	{eventMeaning}
</div>
