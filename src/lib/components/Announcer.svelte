<script lang="ts">
	import { browser } from '$app/environment';

	export let game: Bingo.Card;
	export let user: Bingo.User | undefined;

	let buttonType = '';
	const announcerText = () => {
		// Before Game
		if (game.state == 0) {
			// User in game
			if (user && !game.users.map((x) => x.id).includes(user.id)) {
				buttonType = 'JOIN';
				return 'This game has not started';
			}
			// Start Timer
			buttonType = 'LEAVE';
			const timer = game.events.find((x) => x.action == 'start');
			if (timer) {
				return `The game will start at ${timer.time.getMinutes()}:${timer.time.getSeconds()}`;
			}
			return 'The game will start when the host starts it';
		}
		return '';
	};

	const leave = async () => {
		if (browser) {
			await fetch(`/api/leave_game?id=${game.id}`);
			window.location.reload();
		}
	};

	const join = async () => {
		if (browser) {
			await fetch(`/api/join_game?id=${game.id}&team=RED`);
			window.location.reload();
		}
	};
</script>

<div
	class="min-w-[300px] px-2 font-rounded font-bold flex items-center justify-center rounded-full h-12 bg-zinc-900"
>
	{announcerText()}
	{#if buttonType == 'JOIN'}
		<button on:click={join} class="bg-green-600 p-1 rounded-full text-sm px-2 ml-2">JOIN</button>
	{:else if buttonType == 'LEAVE'}
		<button on:click={leave} class="bg-amber-600 p-1 rounded-full text-sm px-2 ml-2">LEAVE</button>
	{/if}
</div>
