<script lang="ts">
	import type { Writable } from 'svelte/store';
	import TeamListUser from './TeamListUser.svelte';
	import { onMount } from 'svelte';

	export let gameStore: Writable<Bingo.Card>;

	let blueUsers: Bingo.Card.FullUser[] = [];
	let redUsers: Bingo.Card.FullUser[] = [];

	onMount(() => {
		gameStore.subscribe((value) => {
			const red: Bingo.Card.FullUser[] = [];
			const blue: Bingo.Card.FullUser[] = [];
			for (const user of value.users) {
				if (user.team_name == 'RED') {
					red.push(user);
				} else if (user.team_name == 'BLUE') {
					blue.push(user);
				}
			}

			red.sort((a, b) => (a.user.global_rank ?? 999999999) - (b.user.global_rank ?? 999999999));
			blue.sort((a, b) => (a.user.global_rank ?? 999999999) - (b.user.global_rank ?? 999999999));

			redUsers = red;
			blueUsers = blue;
		});
	});
</script>

<div class="p-4 bg-zinc-900 flex gap-4 rounded-lg">
	<div class="relative h-[500px] w-[300px] border-blue-700 border-2 rounded-xl">
		<h1
			class="bg-zinc-900 font-semibold font-rounded text-blue-700 absolute top-0 left-3 w-fit px-2 -translate-y-3.5"
		>
			Blue Team
		</h1>
		<div class="p-2">
			{#each blueUsers as gameuser}
				<TeamListUser {gameuser} />
			{/each}
		</div>
	</div>
	<div class="z-0 relative h-[500px] w-[300px] border-amber-700 border-2 rounded-xl">
		<h1
			class="bg-zinc-900 font-semibold font-rounded text-amber-700 absolute top-0 left-3 w-fit px-2 -translate-y-3.5"
		>
			Red Team
		</h1>
		<div class="p-2 h-full overflow-y-scroll">
			{#each redUsers as gameuser}
				<TeamListUser {gameuser} />
			{/each}
		</div>
	</div>
</div>

<style>
	.overflow-y-scroll::-webkit-scrollbar {
		display: none;
	}
	.overflow-y-scroll {
		scrollbar-width: none;
	}
</style>
