<script lang="ts">
	export let game: Bingo.BingoGame;

	const text = ['Starting soon', 'In Progress', 'Completed'];
</script>

<article class="p-1">
	<a
		class="bg-zinc-800 relative hover:shadow-lg transition p-2 h-24 rounded-xl flex"
		href="/game/{game.id.slice(4)}"
	>
		<div
			data-state={`${game.state}`}
			class="h-full w-1 mr-2 rounded data-[state='0']:bg-green-400 data-[state='1']:bg-blue-600 data-[state='2']:bg-zinc-600"
		></div>
		<div>
			<h2 class="text-lg">
				Game {game.link_id}
			</h2>
			<span class="absolute bottom-2 uppercase right-2 text-zinc-600">{text[game.state]}</span>
		</div>
	</a>
</article>
