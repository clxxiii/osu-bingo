<script lang="ts">
	import osu from './assets/mode-osu.png';
	import mania from './assets/mode-mania.png';
	import taiko from './assets/mode-taiko.png';
	import fruits from './assets/mode-fruits.png';
	import type { Osu } from '$lib/osu';

	export let mode: Osu.Ruleset;
	export let size = 25;

	let image;
	$: {
		switch (mode) {
			case 'osu':
				image = osu;
			case 'mania':
				image = mania;
			case 'taiko':
				image = taiko;
			case 'fruits':
				image = fruits;
		}
	}
</script>

<span style="--size: {size}px">
	<img src={osu} class="size-[var(--size)]" alt="" />
</span>
