<script lang="ts">
	import type { Writable } from 'svelte/store';
	import TeamListUser from './TeamListUser.svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let gameStore: Writable<Bingo.Card>;
	export let team: string;
	export let user: Bingo.User | undefined;
	export let host: boolean = false;

	let users: Bingo.Card.FullUser[] = [];

	onMount(() => {
		gameStore.subscribe((value) => {
			const red: Bingo.Card.FullUser[] = [];
			for (const user of value.users) {
				if (user.team_name == team) {
					red.push(user);
				}
			}

			users = red;
		});
	});
</script>

<div transition:slide={{ axis: 'x' }} class="p-4 h-full w-full bg-zinc-900 flex gap-4 rounded-lg">
	<div
		data-team={team}
		class="relative h-full w-full data-[team=BLUE]:border-blue-700 data-[team=RED]:border-amber-700 border-2 rounded-xl"
	>
		<h1
			data-team={team}
			class="bg-zinc-900 capitalize font-semibold font-rounded data-[team=BLUE]:text-blue-700 data-[team=RED]:text-amber-700 absolute top-0 left-3 w-fit px-2 -translate-y-3.5"
		>
			{team.toLowerCase()} Team
		</h1>
		<div class="p-2 overflow-y-scroll">
			{#each users as gameuser}
				<TeamListUser
					{gameuser}
					movable={host ||
						(gameuser.user_id == user?.id && ($gameStore.allow_team_switching ?? false))}
				/>
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
