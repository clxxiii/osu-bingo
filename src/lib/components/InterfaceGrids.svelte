<script lang="ts">
	import { square } from '$lib/stores';
	import { AlignJustify, MessageCircle, User, X } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	export let state: number = 1;
	let lg_board_height: number;
	let md_board_height: number;
	let sm_board_height: number;

	let show_player_list = false; // used for mobile & half grid
	let show_chat = false; // Just used for mobile
</script>

<!-- Full Screen Grid -->
<div class="large-grid hidden xl:grid" style="--bh: {lg_board_height - 100}px">
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
		bind:clientHeight={lg_board_height}
		class="col-start-2 col-end-3 row-start-1 row-end-5 h-full w-full rounded-xl bg-zinc-800/50 p-2"
	>
		<slot name="board"></slot>
	</div>
	<!-- <div class="col-start-3 col-end-4 row-start-1 row-end-3 h-full w-full rounded-xl">
		<slot name="event-list"></slot>
	</div> -->
	<div class="col-start-3 col-end-4 row-start-1 row-end-5 h-full w-full rounded-xl">
		<slot name="chat"></slot>
	</div>
</div>

<!-- Half Screen Grid -->
<div class="medium-grid hidden md:grid xl:hidden" style="--bh: {md_board_height}px">
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
		bind:clientHeight={md_board_height}
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

<!-- Mobile Grid -->
<div class="mobile-grid grid md:hidden" style="--bh: {sm_board_height}px">
	{#if $square != null}
		<div
			transition:fly={{ duration: 150, x: 50 }}
			class="absolute inset-4 col-start-1 col-end-2 row-start-1 row-end-3 rounded-xl"
		>
			<slot name="square-sidebar"></slot>
		</div>
	{:else}
		{#if show_player_list}
			<div
				class="relative z-10 col-start-1 col-end-2 row-start-2 row-end-3 h-full w-full rounded-xl bg-zinc-600 p-2"
			>
				<slot name="player-list"></slot>
				<button
					on:click={() => (show_player_list = false)}
					class="absolute right-2 top-2 h-8 w-8 rounded-lg hover:bg-black/20"
				>
					<AlignJustify class="size-full"></AlignJustify>
				</button>
			</div>
		{/if}
		<div
			class="row-start-1 row-end-2 h-full w-full rounded-xl"
			transition:fly={{ duration: 150, x: -50 }}
			bind:clientWidth={sm_board_height}
		>
			<slot name="board"></slot>
		</div>
		<div
			class="relative col-start-1 col-end-2 row-start-2 row-end-3 size-full rounded-xl"
			transition:fly={{ duration: 150, x: -50 }}
		>
			<slot name="event-list"></slot>
			<button
				on:click={() => (show_chat = true)}
				class="absolute bottom-2 right-2 h-8 w-8 rounded-lg hover:bg-black/20"
			>
				<MessageCircle class="size-full"></MessageCircle>
			</button>
			<button
				on:click={() => (show_player_list = true)}
				class="absolute right-2 top-2 h-8 w-8 rounded-lg hover:bg-black/20"
			>
				<User class="size-full"></User>
			</button>
		</div>
		{#if show_chat}
			<div
				class="relative z-10 col-start-1 col-end-2 row-start-2 row-end-3 h-full w-full rounded-xl"
				transition:fade={{ duration: 150 }}
			>
				<slot name="chat"></slot>

				<button
					on:click={() => (show_chat = false)}
					class="absolute bottom-2 right-2 h-8 w-8 rounded-lg hover:bg-black/20"
				>
					<X class="size-full"></X>
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.large-grid {
		/* screen height - heading - padding */
		height: calc(100vh - 3rem - 2rem);
		gap: 1rem;
		max-width: calc(100vw - 2rem);

		grid-template-rows: 3fr 3fr 3fr;
		grid-template-columns: 3fr var(--bh) 3fr;
	}

	.medium-grid {
		/* screen height - heading - padding */
		height: calc(100vh - 3rem - 2rem);
		gap: 1rem;
		max-width: calc(100vw - 2rem);

		grid-template-rows: var(--bh) calc(100vh - 3rem - 3rem - var(--bh));
		grid-template-columns: var(--bh) 1fr;
	}

	.mobile-grid {
		/* screen height - heading - padding */
		height: calc(100vh - 3rem - 2rem);
		gap: 1rem;
		max-width: calc(100vw - 2rem);

		grid-template-rows: var(--bh) 1fr;
		grid-template-columns: 1fr;
	}
</style>
