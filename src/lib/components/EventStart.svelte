<script>
	import { Play } from 'lucide-svelte';
	import { game } from '$lib/stores';

	let sent = false;
	const send_board = async () => {
		const body = new FormData();
		await fetch('?/send_board', {
			method: 'POST',
			body
		});
		sent = true;
	};
</script>

<div class="flex size-full h-16 items-center rounded bg-green-600/50 p-2">
	<div class="mr-1 flex size-5 h-full items-center opacity-50">
		<Play />
	</div>
	<div>The game started!</div>
	{#if $game && $game.state == 1}
		<button
			class="absolute right-2 rounded bg-yellow-600 p-1 font-rounded font-black text-zinc-200 disabled:text-zinc-900 disabled:brightness-50"
			disabled={sent}
			on:click={send_board}
		>
			{sent ? 'Sent!' : 'Send Board'}
		</button>
	{/if}
</div>
