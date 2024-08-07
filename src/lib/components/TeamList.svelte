<script lang="ts">
	import type { Writable } from 'svelte/store';
	import TeamListUser from './TeamListUser.svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';

	export let gameStore: Writable<Bingo.Card>;
	export let team: string;
	export let user: Bingo.User | undefined;
	export let host: boolean = false;

	let users: Bingo.Card.FullUser[] = [];
	let gameuser: Bingo.GameUser | null;

	const leave = async () => {
		await fetch(`?/leave_game`, {
			method: 'POST',
			body: new FormData()
		});
	};

	const join = async () => {
		if (!user) {
			if (browser) {
				const params = new URLSearchParams();
				params.set('from', window.location.href + `?join`);
				window.location.href = `/auth/login/osu?${params.toString()}`;
			}
		}
		const data = new FormData();
		data.set('team', team);
		await fetch(`?/join_game`, {
			body: data,
			method: 'POST'
		});
	};

	const move = async () => {
		const data = new FormData();
		data.set('user_id', `${gameuser?.id}`);
		data.set('team', team);
		await fetch(`?/switch_team`, {
			body: data,
			method: 'POST'
		});
	};

	const switchTeam = async () => {
		if (gameuser?.team_name == team) leave();
		else move();
	};

	onMount(() => {
		gameStore.subscribe((value) => {
			const players: Bingo.Card.FullUser[] = [];
			gameuser = null;
			for (const player of value.users) {
				if (player.team_name == team) {
					players.push(player);
				}
				if (user && player.user_id == user.id) {
					gameuser = player;
				}
			}

			users = players;
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
		<div class="absolute bottom-0 w-full p-1 bg-black/30 rounded-xl">
			{#if !gameuser?.team_name}
				<button
					on:click={join}
					class="bg-green-600 hover:bg-green-700 active:bg-green-800 h-8 p-1 rounded-lg font-rounded font-bold w-full text-sm px-2 transition"
					>Join {team.toUpperCase()} team</button
				>
			{:else}
				<button
					on:click={switchTeam}
					data-team={team.toUpperCase()}
					class="data-[team=BLUE]:bg-blue-600 data-[team=BLUE]:hover:bg-blue-700 data-[team=BLUE]:active:bg-blue-800 data-[team=RED]:bg-amber-600 data-[team=RED]:hover:bg-amber-700 data-[team=RED]:active:bg-amber-800 h-8 p-1 rounded-lg font-rounded font-bold w-full text-sm px-2 transition"
				>
					{gameuser.team_name == team ? 'Leave' : 'Switch to'}
					{team.toUpperCase()} team
				</button>
			{/if}
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
