<script lang="ts">
	import { browser } from '$app/environment';
	import { game } from '$lib/stores';
	import { BookCheck, BookText, Flag, Timer } from 'lucide-svelte';

	let gametime: number;
	let progress: number;
	let duration: number;
	let minutes: number = 80;
	let seconds: number = 8;

	let cw: number;

	let start_time: Date;
	let end_time: Date;

	let endless: boolean = false;

	let events: Bingo.TimeEvent[] = [];
	let last_event: Bingo.TimeEvent;

	let interval: globalThis.Timer;

	const update = () => {
		const now = new Date().valueOf();
		const start = start_time.valueOf();

		gametime = now - start;
		seconds = Math.floor((gametime / 1000) % 60);
		minutes = Math.floor(gametime / 1000 / 60);

		progress = gametime / duration;
	};

	const getMeaning = async (event: Bingo.TimeEvent) => {
		if (event && browser) {
			const req = await fetch(`/get_event_meaning?action=${event?.action}`);
			const meaning = await req.text();
			console.log(meaning);
			return meaning;
		}
	};

	game.subscribe((game) => {
		if (!game || !game.start_time) return;

		start_time = new Date(game.start_time);
		events = game.events;
		endless = false;

		let last_event_check = null;
		for (const ev of events) {
			if (last_event_check == null) {
				last_event_check = ev;
				continue;
			}

			if (ev.time > last_event_check.time) {
				last_event_check = ev;
			}
		}
		if (last_event_check == null) return;
		last_event = last_event_check;
		end_time = new Date(last_event.time);
		// Padding is added to the right side of the timer
		// if the event is not a "final" event, since there
		// technically isn't an end
		if (!last_event.action.startsWith('final')) {
			end_time = new Date(end_time.valueOf() + 5 * 60 * 1000);
			endless = true;
		}
		duration = end_time.valueOf() - start_time.valueOf();

		clearInterval(interval);
		interval = setInterval(update, 1000);
		update();
	});
</script>

<div class="mb-2 flex">
	<div class="flex h-[50px] w-full rounded bg-base-800 p-2">
		<div class="flex items-center pr-2">
			<Timer />
		</div>
		<div class="h-full w-full">
			<div class="relative h-full w-full">
				<div
					bind:clientWidth={cw}
					class="absolute bottom-0 left-0 right-2 h-3 overflow-hidden rounded-full bg-zinc-900"
				>
					<div
						class="absolute left-0 h-full rounded-full bg-pink-300"
						style="width: calc(100% * {progress})"
					></div>
				</div>
				{#each events as event}
					<div
						class="absolute left-[--i] top-0 h-full"
						style="--i: {((new Date(event.time).valueOf() - start_time.valueOf()) / duration) *
							cw}px"
					>
						<div class="peer absolute left-[-25px] flex w-[50px] justify-center">
							{#if event.action == 'finalcall'}
								<Flag size={20} />
							{:else if event.fulfilled}
								<BookCheck size={20} />
							{:else}
								<BookText size={20} />
							{/if}
						</div>
						{#await getMeaning(event)}
							...
						{:then meaning}
							<div
								class="invisible absolute -bottom-12 left-[-110px] z-20 w-[220px] rounded bg-zinc-900/80 p-2 text-sm opacity-0 backdrop-blur-sm transition peer-hover:visible peer-hover:opacity-100"
							>
								{meaning}
							</div>
						{/await}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="ml-2 flex h-full items-center rounded bg-base-800 p-2 font-mono font-bold">
		{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}
	</div>
</div>
