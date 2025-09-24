<script lang="ts">
	import { square } from '$lib/stores';
	import { AlignJustify, MessageCircle, User } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import TabBox from '../TabBox.svelte';
	import TabBoxPane from '../TabBoxPane.svelte';

	export let state: number;
	export let host: boolean;

	let board_width: number;
	let board_height: number;
	let grid_height: number;
</script>

<div
	class="mobile-grid grid md:hidden"
	bind:clientHeight={grid_height}
	style="--bw: {board_width}px; --gh: {grid_height}px; --bh: {board_height}px;"
>
	{#if $square == null}
		<!-- Top Box -->
		<div
			class="row-start-1 row-end-2 h-full w-full rounded-xl"
			transition:fly={{ duration: 150, x: -50 }}
			bind:clientWidth={board_width}
			bind:clientHeight={board_height}
		>
			{#if host && state == 0}
				<slot name="host-settings"></slot>
			{:else}
				<slot name="board"></slot>
			{/if}
		</div>

		<!-- Bottom Box -->
		<div
			class="relative col-start-1 col-end-2 row-start-2 row-end-3 mt-4 size-full overflow-hidden rounded-xl"
			style="height: calc(var(--gh) - var(--bh) - 1rem)"
			transition:fly={{ duration: 150, x: -50 }}
		>
			<TabBox>
				<TabBoxPane>
					<slot name="event-list"></slot>
					<div slot="icon" class="flex justify-center"><AlignJustify class="size-[80%]" /></div>
				</TabBoxPane>
				<TabBoxPane>
					<slot name="player-list"></slot>
					<div slot="icon" class="flex justify-center"><User class="size-[80%]" /></div>
				</TabBoxPane>
				<TabBoxPane>
					<slot name="chat"></slot>
					<div slot="icon" class="flex justify-center"><MessageCircle class="size-[80%]" /></div>
				</TabBoxPane>
			</TabBox>
		</div>

		<!-- Square Sidebar -->
	{:else}
		<div
			transition:fly={{ duration: 150, x: 50 }}
			class="absolute inset-4 col-start-1 col-end-2 row-start-1 row-end-3 rounded-xl"
		>
			<slot name="square-sidebar"></slot>
		</div>
	{/if}
</div>

<style>
	.mobile-grid {
		/* screen height - heading - padding */
		height: calc(100vh - 3rem - 2rem);
		max-width: calc(100vw - 2rem);

		grid-template-rows: var(--bh) 1fr;
		grid-template-columns: 1fr;
	}
</style>
