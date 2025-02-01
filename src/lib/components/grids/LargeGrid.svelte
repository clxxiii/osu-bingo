<script lang="ts">
	import { square } from '$lib/stores';
	import { AlignJustify } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let state: number;
	export let host: boolean = false;
	let board_height: number;
</script>

<div class="large-grid" style="--bh: {board_height - 100}px">
	{#if $square != null && state != 0}
		<div
			transition:fade={{ duration: 150 }}
			class="z-10 col-start-1 col-end-2 row-start-1 row-end-5 h-full w-full rounded-xl"
		>
			<slot name="square-sidebar"></slot>
		</div>
	{/if}
	<div class="col-start-1 col-end-2 row-start-1 row-end-5 h-full w-full rounded-xl shadow-xl">
		<slot name="player-list"></slot>
	</div>
	<div
		bind:clientHeight={board_height}
		class="col-start-2 col-end-3 row-start-1 row-end-5 aspect-square h-full w-full rounded-xl bg-zinc-800/50 p-2"
	>
		{#if host && state == 0}
			<slot name="host-settings"></slot>
		{:else}
			<slot name="board"></slot>
		{/if}
	</div>
	<!-- <div class="col-start-3 col-end-4 row-start-1 row-end-3 h-full w-full rounded-xl">
		<slot name="event-list"></slot>
	</div> -->
	<div class="col-start-3 col-end-4 row-start-1 row-end-5 h-full w-full rounded-xl">
		<div
			class="event-grid mb-4 grid h-[calc(100vh-300px-4rem-1rem-1rem)] overflow-hidden rounded-xl bg-zinc-800"
		>
			<div class="flex pl-2 pt-2 font-rounded text-xl">
				<AlignJustify />
				<span class="pl-2"> Events </span>
			</div>
			<div class="overflow-y-hidden">
				<slot name="event-list"></slot>
			</div>
		</div>
		<div class="h-[300px]">
			<slot name="chat"></slot>
		</div>
	</div>
</div>

<style>
	.large-grid {
		/* screen height - heading - padding */
		height: calc(100vh - 3rem - 2rem);
		gap: 1rem;
		max-width: calc(100vw - 2rem);

		display: grid;
		grid-template-rows: 3fr 3fr 3fr;
		grid-template-columns: 3fr var(--bh) 3fr;
	}
	.event-grid {
		grid-template-rows: 2rem 1fr;
	}
</style>
