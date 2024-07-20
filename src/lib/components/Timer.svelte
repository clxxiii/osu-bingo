<script lang="ts">
	import { Clock } from 'lucide-svelte';

	export let time: Date | undefined;
	export let clock = true;

	const soonMS = 60 * 1000;

	let interval: Timer;
	let text: string;
	let soon = false;

	$: time && startTimer(time);
	const startTimer = (time: Date) => {
		if (typeof time == 'string') {
			time = new Date(time);
		}

		const updateText = () => {
			const difference = new Date(time.valueOf() - new Date().valueOf());
			const mins = difference.getMinutes();
			const secs = difference.getSeconds();

			text = `${mins}:${secs < 10 ? '0' + secs : secs}`;
			soon = time.valueOf() - Date.now() < soonMS;
		};

		updateText();
		clearInterval(interval);
		interval = setInterval(updateText, 1000);
	};
</script>

{#if time}
	<span data-soon={soon} class="data-[soon=true]:animate-warning flex items-center gap-x-1">
		{#if text}
			{text}
			{#if clock}
				<Clock class="size-4" />
			{/if}
		{/if}
	</span>
{/if}
