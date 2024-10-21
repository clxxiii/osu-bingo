<script lang="ts">
	import { backInOut, circInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	export let size = 100;
	export let duration = 300;

	const slide = tweened(0, {
		easing: circInOut,
		duration
	});
	const rotate = tweened(90, {
		easing: backInOut,
		duration
	});

	const animate = async () => {
		const sleep = async (t: number) => await new Promise((r) => setTimeout(r, t));
		rotate.set(0, { duration: 0 });
		slide.set(0, { duration: 0 });
		slide.set(1);
		await sleep(duration);
		rotate.set(90, { duration: 0 });
		slide.set(0, { duration: 0 });
		slide.set(1);
		await sleep(duration);
		rotate.set(90 * 2, { duration: 0 });
		slide.set(0, { duration: 0 });
		slide.set(1);
		await sleep(duration);
		rotate.set(90 * 3, { duration: 0 });
		slide.set(0, { duration: 0 });
		slide.set(1);
		await sleep(duration);
		rotate.set(90 * 5, { duration: duration * 3 });
	};

	setInterval(animate, duration * 7.5);
	animate();
</script>

<div
	style="--s: {size / 3}px; --s3: {size}px; --r: {$rotate}deg; --b: {size / 50}px"
	class="size-[var(--s3)] rotate-[var(--r)]"
>
	<div class="relative h-[var(--s)] w-[var(--s3)] overflow-hidden">
		<div style="--x: calc(-100% + {$slide} * 100%); --y: 0%" class="squarebox">
			<div class="square bg-pink-300"></div>
		</div>
		<div style="--x: calc({$slide} * 100%); --y: 0%" class="squarebox">
			<div class="square bg-pink-300"></div>
		</div>
		<div style="--x: calc(100% + {$slide} * 100%); --y: 0%" class="squarebox">
			<div class="square bg-pink-300"></div>
		</div>
		<div style="--x: calc(200% + {$slide} * 100%); --y: 0%" class="squarebox">
			<div class="square bg-pink-300"></div>
		</div>
	</div>
	<div style="--x: 0%; --y: 0%" class="squarebox">
		<div class="square bg-pink-300"></div>
	</div>
	<div style="--x: 100%; --y: 0%" class="squarebox">
		<div class="square bg-white"></div>
	</div>
	<div style="--x: 200%; --y: 0%" class="squarebox">
		<div class="square bg-pink-300"></div>
	</div>
	<div style="--x: 0%; --y: 0%" class="squarebox">
		<div class="square bg-pink-300"></div>
	</div>
	<div style="--x: 0%; --y: 100%" class="squarebox">
		<div class="square bg-pink-300"></div>
	</div>
	<div style="--x: 100%; --y: 100%" class="squarebox">
		<div class="square bg-pink-300"></div>
	</div>
	<div style="--x: 200%; --y: 100%" class="squarebox">
		<div class="square bg-pink-300"></div>
	</div>
</div>

<style>
	.squarebox {
		position: absolute;
		width: var(--s);
		height: var(--s);
		padding: var(--b);
		transform: translate(var(--x), var(--y));
	}
	.square {
		width: 100%;
		height: 100%;
		border-radius: calc(2 * var(--b));
	}
</style>
