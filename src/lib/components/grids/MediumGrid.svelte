<script lang="ts">
	import { square } from '$lib/stores';
	import { AlignJustify, User } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let state: number;
	let board_height: number;
	let show_player_list = false;
</script>

<div class="medium-grid" style="--bh: {board_height}px">
	{#if $square != null && state != 0}
		<div class="z-20 col-start-2 col-end-3 row-start-1 row-end-3 h-full w-full rounded-xl">
			<slot name="square-sidebar"></slot>
		</div>
	{/if}
	{#if show_player_list || state == 0}
		<div
			class="relative z-10 col-start-2 col-end-3 row-start-1 row-end-3 h-full w-full rounded-xl shadow-xl"
			transition:fade={{ duration: 150 }}
		>
			<slot name="player-list"></slot>
			{#if state != 0}
				<button
					on:click={() => (show_player_list = false)}
					class="absolute right-2 top-2 h-8 w-8 rounded-lg hover:bg-black/20"
				>
					<AlignJustify class="size-full"></AlignJustify>
				</button>
			{/if}
		</div>
	{/if}
	<div
		bind:clientHeight={board_height}
		class="col-start-1 col-end-2 h-full max-h-[500px] w-full rounded-xl"
	>
		<slot name="board"></slot>
	</div>
	{#if state != 0}
		<div
			class="relative col-start-2 col-end-3 row-start-1 row-end-3 h-full w-full rounded-xl"
			transition:fade={{ duration: 150 }}
		>
			<slot name="event-list"></slot>
			<button
				on:click={() => (show_player_list = true)}
				class="absolute right-2 top-2 h-8 w-8 rounded-lg hover:bg-black/20"
			>
				<User class="size-full"></User>
			</button>
		</div>
	{/if}
	<div class="col-start-1 col-end-2 row-start-2 row-end-3 h-full w-full rounded-xl">
		<slot name="chat"></slot>
	</div>
</div>

<style>
	.medium-grid {
		/* screen height - heading - padding */
		height: calc(100vh - 3rem - 2rem);
		gap: 1rem;
		max-width: calc(100vw - 2rem);

		display: grid;
		grid-template-rows: var(--bh) calc(100vh - 3rem - 3rem - var(--bh));
		grid-template-columns: var(--bh) 1fr;
	}
</style>
