<script lang="ts">
	import type { Writable } from 'svelte/store';
	import EventScore from './EventScore.svelte';
	import { fly } from 'svelte/transition';
	import EventTime from './EventTime.svelte';
	import EventStart from './EventStart.svelte';
	import { afterUpdate } from 'svelte';

	type Event = ScoreInfo | TimeEvent | StartEvent;
	type StartEvent = {
		type: 'start';
		date: Date;
	};
	const isStart = (e: Event): e is StartEvent => e.type == 'start';

	type TimeEvent = {
		type: 'time';
		date: Date;
		data: Bingo.TimeEvent;
	};
	const isTimeEvent = (e: Event): e is TimeEvent => e.type == 'time';

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

	export let store: Writable<Bingo.Card | null>;

	const events: Event[] = [];
	store.subscribe((card) => {
		if (!card || !card.squares) return;

		// Sort stuff by date to add to list
		const scores: {
			score: Bingo.Card.FullScore;
			square: Bingo.Card.FullSquare;
			square_index: number;
		}[] = [];
		const time_events = [];
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
		for (const event of card.events) {
			time_events.push(event);
		}

		if (card.start_time != null && card.state != 0) {
			events.push({
				type: 'start',
				date: card.start_time
			});
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

		const event_id_map = events.filter((x) => isTimeEvent(x)).map((x) => x.data.id);
		for (const event of time_events) {
			if (!event_id_map.includes(event.id)) {
				events.push({
					type: 'time',
					date: event.time,
					data: event
				});
			}
		}

		events.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
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

<div bind:this={box} class="flex size-full flex-col gap-2 overflow-y-scroll pr-2">
	{#each events as event}
		<div class="relative w-full" transition:fly={{ x: 30, duration: 1000 }}>
			{#if isScore(event)}
				<EventScore
					score={event.data.score}
					square={event.data.square}
					square_index={event.data.square_index}
					stat={$store?.tiebreaker ?? ''}
				/>
			{:else if isTimeEvent(event)}
				{#if new Date(event.data.time).valueOf() < new Date().valueOf() && event.data.fulfilled}
					<EventTime event={event.data} />
				{/if}
			{:else if isStart(event)}
				<EventStart />
			{/if}
		</div>
	{/each}
</div>
