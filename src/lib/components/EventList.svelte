<script lang="ts">
	import EventScore from './EventScore.svelte';
	import { fly } from 'svelte/transition';
	import EventTime from './EventTime.svelte';
	import EventStart from './EventStart.svelte';
	import { afterUpdate } from 'svelte';
	import { game as store, game_rules } from '$lib/stores';
	import { getEvents } from '$lib/gamerules/get_rules';
	import type { Options } from '$lib/gamerules/options';

	type Event = ScoreInfo | GameEvent | StartEvent;
	type StartEvent = {
		type: 'start';
		date: Date;
	};
	const isStart = (e: Event): e is StartEvent => e.type == 'start';

	type GameEvent = {
		id: string;
		type: 'time';
		date: Date;
		data: Options.Event;
	};
	const isGameEvent = (e: Event): e is GameEvent => e.type == 'time';

	type ScoreInfo = {
		type: 'score';
		date: Date;
		data: {
			score: Bingo.Card.FullScore;
			square: Bingo.Card.FullSquare;
			square_index: number;
		};
	};
	const isScore = (e: Event): e is ScoreInfo => e.type == 'score';

	let events: Event[] = [];
	store.subscribe((card) => {
		if (!card || !card.squares) return;

		// Sort stuff by date to add to list
		const scores: {
			score: Bingo.Card.FullScore;
			square: Bingo.Card.FullSquare;
			square_index: number;
		}[] = [];
		const time_events: Options.Event[] = [];
		for (let i = 0; i < card.squares.length; i++) {
			const square = card.squares[i];
			for (const score of square.scores) {
				scores.push({
					score,
					square,
					square_index: i
				});
			}
		}

		const eventList = getEvents(card) ?? [];
		for (const event of eventList) {
			time_events.push(event);
		}

		if (card.start_time != null && card.state != 0) {
			const startEvent = events.find(isStart);
			if (!startEvent) {
				events.push({
					type: 'start',
					date: card.start_time
				});
			}
		}

		// Add new scores
		const score_id_map = events.filter((x) => isScore(x)).map((x) => x.data.score.id);
		for (const score of scores) {
			if (!score_id_map.includes(score.score.id)) {
				events.push({
					type: 'score',
					date: score.score.date,
					data: score
				});
			}
		}

		const event_id_map = events.filter((x) => isGameEvent(x)).map((x) => x.id);
		for (const event of time_events) {
			const id = event.event + ((card.start_time?.valueOf() ?? 0) + event.seconds_after_start);
			if (!event_id_map.includes(id)) {
				events.push({
					id,
					type: 'time',
					date: new Date((card.start_time?.valueOf() ?? 0) + event.seconds_after_start * 1000),
					data: event
				});
			}
		}

		events.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());

		// Because we haven't upgraded to svelte 5 yet, we have to do this to tell svelte to update the list
		events = [...events];
	});

	// Autoscroll
	let box: HTMLDivElement;
	const scrollToBottom = () => {
		if (!box) return;

		box.scroll({
			top: box.scrollHeight,
			behavior: 'smooth'
		});
	};
	afterUpdate(scrollToBottom);
</script>

<div bind:this={box} class="flex size-full flex-col gap-2 overflow-x-hidden overflow-y-scroll pr-2">
	{#each events as event}
		<div class="relative w-full" transition:fly={{ x: 30, duration: 1000 }}>
			{#if isScore(event)}
				<EventScore
					score={event.data.score}
					square={event.data.square}
					square_index={event.data.square_index}
					stat={$game_rules?.reclaim_condition ?? ''}
				/>
			{:else if isGameEvent(event)}
				{#if new Date(event.date).valueOf() < new Date().valueOf()}
					<EventTime event={event.data} />
				{/if}
			{:else if isStart(event)}
				<EventStart />
			{/if}
		</div>
	{/each}
</div>
