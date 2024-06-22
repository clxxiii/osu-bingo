<script lang="ts">
	import { type Writable } from 'svelte/store';

	export let gameStore: Writable<Bingo.Card>;
	export let user: Bingo.User | undefined;

	let text: string;
	let gameId: string;

	// Takes an announcement and replaces [X] with a
	// countdown to the specified date.
	let interval: Timer;
	const startTimer = (template: string, time: Date) => {
		if (typeof time == 'string') {
			time = new Date(time);
		}

		const updateText = () => {
			const difference = new Date(time.valueOf() - new Date().valueOf());
			const mins = difference.getMinutes();
			const secs = difference.getSeconds();

			text = template.replaceAll('[X]', `${mins}:${secs < 10 ? '0' + secs : secs}`);
		};

		updateText();
		interval = setInterval(updateText, 1000);
	};

	let buttonType = '';
	const update = (game: Bingo.Card) => {
		if (interval) clearInterval(interval);
		gameId = game.id;

		// Before Game
		if (game.state == 0) {
			// User in game
			if (user && !game.users.map((x) => x.user_id).includes(user.id)) {
				buttonType = 'JOIN';
				text = 'This game has not started';
				return;
			}
			// Start Timer
			buttonType = 'LEAVE';
			const timer = game.events.find((x) => x.action == 'start');
			if (timer) {
				startTimer('The game will start in [X]', timer.time);
				return;
			}
			text = 'The game will start when the host starts it';
			return;
		}
		text = '';
	};

	const leave = async () => {
		await fetch(`?/leave_game`, {
			method: 'POST',
			body: new FormData()
		});
	};

	const join = async () => {
		const data = new FormData();
		data.set('team', 'RED');
		await fetch(`?/join_game`, {
			body: data,
			method: 'POST'
		});
	};

	gameStore.subscribe((value) => update(value));
</script>

<div
	class="min-w-[300px] px-4 font-rounded font-bold flex items-center justify-center rounded-full h-12 bg-zinc-900"
>
	{text}
	{#if buttonType == 'JOIN'}
		<button on:click={join} class="bg-green-600 p-1 rounded-full text-sm px-2 ml-2">JOIN</button>
	{:else if buttonType == 'LEAVE'}
		<button on:click={leave} class="bg-amber-600 p-1 rounded-full text-sm px-2 ml-2">LEAVE</button>
	{/if}
</div>
