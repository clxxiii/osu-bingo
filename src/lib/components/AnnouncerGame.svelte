<script lang="ts">
	import { getMeaning } from '$lib/bingo-helpers/claimworthy';
	import type { Writable } from 'svelte/store';
	import AnnouncerTeam from './AnnouncerTeam.svelte';
	import AnnouncerEvent from './AnnouncerEvent.svelte';

	export let gameStore: Writable<Bingo.Card>;
	export let currentTeam: string | undefined;
	export let user: Bingo.User | undefined;

	let claimText: string;
	let nextEvent: Bingo.TimeEvent | undefined = undefined;
	gameStore.subscribe((card) => {
		claimText = getMeaning(card.claim_condition);
		nextEvent = card.events
			.filter((x) => !x.fulfilled)
			.sort((a, b) => a.time.valueOf() - b.time.valueOf())[0];
	});
</script>

<div class="flex h-full items-center justify-between gap-x-2 p-2">
	<AnnouncerTeam {currentTeam} {user} />

	<div class="h-full rounded-lg bg-zinc-900/50 p-2 font-rounded">
		<h2 class="text-xl">Current Rules:</h2>
		<ul class="ml-4 list-disc">
			<li>
				<span class="text-green-400">{claimText}</span> to claim a square
			</li>
			<li>
				Reclaim a square by getting a higher <span class="text-green-400"
					>{$gameStore.tiebreaker}</span
				>
			</li>
		</ul>
	</div>

	<AnnouncerEvent event={nextEvent} />
</div>
