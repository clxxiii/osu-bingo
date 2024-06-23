<script lang="ts">
	import osu from './assets/mode-osu.png';
	import mania from './assets/mode-mania.png';
	import taiko from './assets/mode-taiko.png';
	import fruits from './assets/mode-fruits.png';

	export let mode: string;
	export let size = 25;

	let image: string;
	$: {
		switch (mode) {
			case 'osu':
				image = osu;
				break;
			case 'mania':
				image = mania;
				break;
			case 'taiko':
				image = taiko;
				break;
			case 'fruits':
				image = fruits;
				break;
		}
	}
</script>

<span style="--size: {size}px">
	<img src={image} class="size-[var(--size)]" alt="" />
</span>
