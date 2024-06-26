<script lang="ts">
	import { LogOut, Settings, X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { tweened, type Tweened } from 'svelte/motion';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let user: Bingo.User | undefined;
	let width: Tweened<number>;

	let nameplateWidth: number;

	export let expanded = false;

	const click = () => {
		expanded = !expanded;
		if (expanded) {
			$width = 150;
		} else {
			$width = nameplateWidth;
		}
	};

	onMount(() => {
		width = tweened(nameplateWidth, {
			duration: 300,
			easing: cubicInOut
		});
	});
</script>

{#if user != undefined}
	<div
		data-expand={expanded}
		style="--w: {$width}px"
		class="hover:bg-zinc-900 transition w-[var(--w)] items-center data-[expand=true]:bg-zinc-900 h-10 rounded overflow-hidden"
	>
		{#if expanded}
			<div class="flex items-center justify-evenly h-full">
				<button
					in:fly={{ y: 30, delay: 300 }}
					out:fly={{ y: -30, delay: 0 }}
					on:click={click}
					class="size-8 flex items-center hover:bg-zinc-700 justify-center transition rounded"
				>
					<X />
				</button>
				<a
					in:fly={{ y: 30, delay: 350 }}
					out:fly={{ y: -30, delay: 50 }}
					class="size-8 flex items-center hover:bg-zinc-700 justify-center transition rounded"
					href="/user/settings"
				>
					<Settings />
				</a>
				<a
					in:fly={{ y: 30, delay: 400 }}
					out:fly={{ y: -30, delay: 100 }}
					class="size-8 text-amber-600 flex items-center hover:bg-zinc-700 justify-center transition rounded"
					href="/auth/logout"
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
				class="text-display grid gap-x-1 items-center px-2 h-10 absolute top-0 transition"
			>
				<img
					class="row-start-1 row-end-3 col-start-1 col-end-2 h-8 rounded-full"
					src={user.avatar_url}
					alt=""
				/>
				<div class="text-left col-start-2 col-end-3 row-start-1 row-end 2">{user.username}</div>
				<div class="text-[8px] text-left col-start-2 col-end-3 row-start-2 row-end-3">
					#{user.global_rank?.toLocaleString()}
				</div>
			</button>
		{/if}
	</div>
{:else if browser}
	<a
		class="font-rounded px-10 hover:bg-pink-900 transition active:bg-pink-950 font-bold bg-pink-800 border-pink-200 rounded-full p-1 w-40"
		href="/auth/login/osu?from={window.location.href}">login with osu!</a
	>
{/if}

<style>
	button.grid {
		grid-template-columns: 2rem calc(100% - 2rem);
	}
</style>
