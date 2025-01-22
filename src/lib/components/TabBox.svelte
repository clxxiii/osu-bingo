<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	export let tab = 0;
	export let duration = 150;

	const bar1 = tweened(0, {
		duration,
		easing: cubicInOut
	});
	const bar2 = tweened(0, {
		duration,
		easing: cubicInOut
	});

	let data: HTMLElement;
	let icons: HTMLElement[] = [];
	let panes: HTMLElement[] = [];

	$: {
		if (data) {
			icons = [];
			panes = [];
			data.childNodes.forEach((v) => {
				if ((v as HTMLElement)?.classList?.contains('pane')) panes.push(v as HTMLElement);
				if ((v as HTMLElement)?.classList?.contains('icon')) icons.push(v as HTMLElement);
			});
		}

		switchTabs(tab);
	}

	const switchTabs = (n: number) => {
		tab = n;

		const interval = 1 / panes.length;
		bar1.set(tab * interval);
		bar2.set((panes.length - (tab + 1)) * interval);
	};
</script>

<!-- Used to get the slot data -->
<div class="hidden" bind:this={data}>
	<slot />
</div>

<div class="flex size-full bg-zinc-800">
	{#if panes[tab]}
		<div class="size-full">
			{@html panes[tab].innerHTML}
		</div>
	{/if}
	<div class="space-evenly relative flex h-full w-[50px] flex-col align-middle">
		{#each icons as icon, i}
			<button on:click={() => switchTabs(i)} class="z-10 size-full">
				{@html icon.innerHTML}
			</button>
		{/each}
		<!-- Tab blockers -->
		<div
			class="absolute top-0 z-0 w-full rounded-bl-xl bg-zinc-900"
			style="height: calc(100% * {$bar1})"
		></div>
		<div
			class="absolute bottom-0 z-0 w-full rounded-tl-xl bg-zinc-900"
			style="height: calc(100% * {$bar2})"
		></div>
	</div>
</div>
