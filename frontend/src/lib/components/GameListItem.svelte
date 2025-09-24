<script lang="ts">
	import { formatDistance } from 'date-fns';
	export let game: Bingo.BingoGame;

	const text = ['Starting soon', 'Started', 'Finished'];
</script>

<article class="p-1">
	<a
		class="relative flex h-24 rounded-xl bg-zinc-800 p-2 transition hover:shadow-lg"
		href="/game/{game.id.slice(4)}"
	>
		<div
			data-state={`${game.state}`}
			class="mr-2 h-full w-1 rounded data-[state='0']:bg-green-400 data-[state='1']:bg-blue-600 data-[state='2']:bg-zinc-600"
		></div>
		<div>
			<h2 class="text-lg">
				Game {game.link_id}
			</h2>
			<h3 class="text-lg font-light uppercase text-zinc-600">
				{text[game.state]}

				{#if game.start_time}
					<span class="text-lg text-zinc-600"
						>{formatDistance(game.start_time, new Date(), { addSuffix: true })}</span
					>
				{/if}
			</h3>
		</div>
	</a>
</article>
