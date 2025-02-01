<script>
	import { Play } from 'lucide-svelte';

	const send_board = async () => {
		const body = new FormData();
		const res = await fetch('?/send_board', {
			method: 'POST',
			body
		});
	};
</script>

<div class="flex size-full rounded bg-green-600/50 p-2">
	<div class="mr-1 flex size-5 h-full items-center opacity-50">
		<Play />
	</div>
	<div>The game started!</div>
	<!-- <button on:click={send_board}> Send Board </button> -->
</div>
