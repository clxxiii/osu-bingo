<script lang="ts">
	import { Clock, Star } from 'lucide-svelte';
	import MapStat from './MapStat.svelte';

	export let map: Bingo.Card.FullMap;

	const seconds = (time: number) => {
		const seconds = time % 60;
		return seconds > 9 ? seconds : `0${seconds}`;
	};

	const timeString = `${Math.floor(map.stats.length / 60)}:${seconds(map.stats.length)}`;
</script>

<div class="grid top bg-zinc-900">
	<img
		class="rounded-l-lg row-start-1 row-end-1 col-start-1 col-end-2"
		src={map.cover_url}
		alt=""
	/>
	<div
		class="bg-zinc-900 -translate-x-2 pl-2 rounded-l-lg flex flex-col justify-center font-rounded"
	>
		<div class="text-xl font-extrabold">{map.title}</div>
		<div class="font-bold">by {map.artist}</div>
		<div>[{map.difficulty_name}]</div>
		<div class="text-xs pt-2">
			<MapStat>{map.stats.star_rating} <Star class="inline" size={14} /></MapStat>
			<MapStat>{timeString} <Clock class="inline" size={14} /></MapStat>
			<MapStat>{map.stats.bpm} BPM</MapStat>
			<MapStat>CS{map.stats.cs}</MapStat>
			<MapStat>AR{map.stats.ar}</MapStat>
			<MapStat>OD{map.stats.od}</MapStat>
		</div>
	</div>
	<div
		class="mt-2 p-2 w-full row-start-3 row-end-4 col-start-1 col-end-3 bg-zinc-700 flex justify-around"
	>
		<a
			class="font-rounded block bg-pink-800 rounded w-40 text-center font-bold hover:bg-pink-700 active:bg-pink-900 transition"
			href="osu://dl/{map.beatmapset_id}">osu!Direct</a
		>
		<a
			class="font-rounded block bg-pink-800 rounded w-40 text-center font-bold hover:bg-pink-700 active:bg-pink-900 transition"
			target="_blank"
			rel="noopener noreferrer"
			href="https://osu.ppy.sh/b/{map.id}">Open on osu!web</a
		>
	</div>
</div>

<style>
	div.top {
		grid-template-columns: fit-content(120px) 1fr;
		grid-template-rows: fit-content(120px) 1fr;
	}
</style>
