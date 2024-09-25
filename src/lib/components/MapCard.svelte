<script lang="ts">
	import { Clock, Star } from 'lucide-svelte';
	import MapStat from './MapStat.svelte';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';

	export let map: Bingo.Card.FullMap;

	const seconds = (time: number) => {
		const seconds = time % 60;
		return seconds > 9 ? seconds : `0${seconds}`;
	};

	const timeString = `${Math.floor(map.stats.length / 60)}:${seconds(map.stats.length)}`;

	let showCopy: boolean;
	const copy = () => {
		showCopy = true;
		setTimeout(() => (showCopy = false), 1);

		const id = `${map.id}`;

		if (browser) {
			navigator.clipboard.writeText(id);
		}
	};
</script>

<div class="top grid bg-zinc-900">
	<img
		class="col-start-1 col-end-2 row-start-1 row-end-1 rounded-l-lg"
		src={map.square_url}
		alt=""
	/>
	<div
		class="flex -translate-x-2 flex-col justify-center rounded-l-lg bg-zinc-900 pl-2 font-rounded"
	>
		<div class="text-xl font-extrabold">{map.title}</div>
		<div class="font-bold">by {map.artist}</div>
		<div>[{map.difficulty_name}]</div>
		<div class="pt-2 text-xs">
			<MapStat>{map.stats.star_rating} <Star class="inline" size={14} /></MapStat>
			<MapStat>{timeString} <Clock class="inline" size={14} /></MapStat>
			<MapStat>{map.stats.bpm} BPM</MapStat>
			<MapStat>CS{map.stats.cs}</MapStat>
			<MapStat>AR{map.stats.ar}</MapStat>
			<MapStat>OD{map.stats.od}</MapStat>
		</div>
	</div>
	<div
		class="col-start-1 col-end-3 row-start-3 row-end-4 mt-2 flex w-full justify-around bg-zinc-700 p-2"
	>
		<button
			on:click={copy}
			class="relative block w-40 rounded bg-pink-800 text-center font-rounded font-bold transition hover:bg-pink-700 active:bg-pink-900"
		>
			{#if showCopy}
				<div
					out:fly={{ y: -20, duration: 500 }}
					class="text-s absolute w-full text-center text-green-400"
				>
					Copied
				</div>
			{/if}
			Copy Map ID
		</button>
		<a
			class="block w-40 rounded bg-pink-800 text-center font-rounded font-bold transition hover:bg-pink-700 active:bg-pink-900"
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
