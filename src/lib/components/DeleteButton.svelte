<script lang="ts">
	import { browser } from '$app/environment';
	import { promise } from '$lib/toast';
	import { Trash2Icon } from 'lucide-svelte';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const confirm_time = 2_000;

	let clicked = false;
	const action = async () => {
		clicked = true;

		const body = new FormData();
		const p = fetch('?/delete_game', { method: 'POST', body });

		p.then(() => {
			setTimeout(() => {
				if (browser) window.location.href = '/games';
			}, 2000);
		});

		promise(p, {
			progress: 'Deleting Game...'
		});
	};

	const progress = tweened(0, {
		easing: cubicOut,
		duration: confirm_time
	});

	const size = 24;

	let timeout: NodeJS.Timer;
	const mousedown = () => {
		timeout = setTimeout(action, confirm_time);
		progress.set(1, { duration: confirm_time });
	};
	const mouseup = () => {
		clearTimeout(timeout);
		if (!clicked) progress.set(0, { duration: 100 });
	};
</script>

<button
	style="--s: {size}px"
	class="group relative overflow-hidden rounded-lg bg-zinc-900 p-[calc(var(--s)/2)] text-red-400 transition hover:bg-red-500 hover:text-zinc-300"
	on:mousedown={mousedown}
	on:mouseup={mouseup}
	on:mouseleave={mouseup}
>
	<div
		class="absolute left-0 top-0 h-full bg-red-400"
		style="width: calc(100% * {$progress})"
	></div>
	<div
		class="relative grid h-[--s] w-[--s] overflow-hidden transition-all group-hover:w-[calc(var(--s)*10)]"
	>
		<div class="flex h-[--s] w-[--s] justify-center transition group-hover:-translate-y-[100%]">
			<Trash2Icon />
		</div>
		<div class="h-[--s] font-black uppercase transition group-hover:-translate-y-[100%]">
			Delete game
		</div>
	</div>
</button>
