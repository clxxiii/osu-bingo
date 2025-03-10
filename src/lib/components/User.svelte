<script lang="ts">
	import { LogOut, Settings, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { tweened, type Tweened } from 'svelte/motion';
	import { user } from '$lib/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let width: Tweened<number>;

	let nameplateWidth: number;

	export let expanded = false;

	const click = () => {
		expanded = !expanded;
		if (expanded) {
			$width = 100;
		} else {
			$width = nameplateWidth;
		}
	};

	// If width gets created before nameplateWidth, width will be undefined and the user won't be visible
	$: if (width && $width == undefined) $width = nameplateWidth;

	onMount(() => {
		width = tweened(nameplateWidth, {
			duration: 300,
			easing: cubicInOut
		});
	});
</script>

{#if $user != undefined && browser}
	<div
		data-expand={expanded}
		style="--w: {$width ?? 100}px"
		class="relative h-10 w-[var(--w)] items-center overflow-hidden rounded transition hover:bg-zinc-900 data-[expand=true]:bg-zinc-900"
	>
		{#if expanded}
			<div class="flex h-full items-center justify-evenly">
				<button
					in:fly={{ y: 30, delay: 300 }}
					out:fly={{ y: -30, delay: 0 }}
					on:click={click}
					class="flex size-8 items-center justify-center rounded transition hover:bg-zinc-700"
				>
					<X />
				</button>
				<!-- <a
					in:fly={{ y: 30, delay: 350 }}
					out:fly={{ y: -30, delay: 50 }}
					class="flex size-8 items-center justify-center rounded transition hover:bg-zinc-700"
					href="/user/settings"
				>
					<Settings />
				</a> -->
				<a
					in:fly={{ y: 30, delay: 400 }}
					out:fly={{ y: -30, delay: 100 }}
					class="flex size-8 items-center justify-center rounded text-amber-600 transition hover:bg-zinc-700"
					href="/auth/logout?from={window.location.href}"
				>
					<LogOut />
				</a>
			</div>
		{:else}
			<button
				in:fly={{ y: 30, delay: 300 }}
				out:fly={{ y: -30 }}
				on:click={click}
				bind:clientWidth={nameplateWidth}
				class="text-display absolute top-0 grid h-10 items-center gap-x-1 px-2 transition"
			>
				<img
					class="col-start-1 col-end-2 row-start-1 row-end-3 h-8 rounded-full"
					src={$user.avatar_url}
					alt=""
				/>
				<div class="col-start-2 col-end-3 row-start-1 row-end-2 whitespace-nowrap text-left">
					{$user.username}
				</div>
				<div class="col-start-2 col-end-3 row-start-2 row-end-3 text-left text-[8px]">
					#{$user.global_rank?.toLocaleString()}
				</div>
			</button>
		{/if}
	</div>
{:else if browser}
	<a
		class="w-40 rounded-full border-pink-200 bg-pink-800 p-1 px-10 font-rounded font-bold transition hover:bg-pink-900 active:bg-pink-950"
		href="/auth/login/osu?from={window.location.href}">login with osu!</a
	>
{/if}

<style>
	button.grid {
		grid-template-columns: 2rem calc(100% - 2rem);
	}
</style>
