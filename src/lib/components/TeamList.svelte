<script lang="ts">
	import type { Writable } from 'svelte/store';
	import TeamListUser from './TeamListUser.svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';

	export let gameStore: Writable<Bingo.Card | null>;
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
			if (!value) return;

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

<div class="flex h-full w-full gap-4 rounded-lg bg-zinc-900 p-4">
	<div
		data-team={team}
		class="relative h-full w-full rounded-xl border-2 data-[team=BLUE]:border-blue-700 data-[team=RED]:border-amber-700"
	>
		<h1
			data-team={team}
			class="absolute left-3 top-0 w-fit -translate-y-3.5 bg-zinc-900 px-2 font-rounded font-semibold capitalize data-[team=BLUE]:text-blue-700 data-[team=RED]:text-amber-700"
		>
			{team.toLowerCase()} Team
		</h1>
		<div class="overflow-y-scroll p-2">
			{#each users as gameuser}
				<TeamListUser
					{gameuser}
					movable={host ||
						(gameuser.user_id == user?.id && ($gameStore?.allow_team_switching ?? false))}
				/>
			{/each}
		</div>
		{#if $gameStore && $gameStore.state == 0}
			<div class="absolute bottom-0 w-full rounded-xl bg-black/30 p-1">
				{#if !gameuser?.team_name}
					<button
						on:click={join}
						class="h-8 w-full rounded-lg bg-green-600 p-1 px-2 font-rounded text-sm font-bold transition hover:bg-green-700 active:bg-green-800"
						>Join {team.toUpperCase()} team</button
					>
				{:else}
					<button
						on:click={switchTeam}
						data-team={team.toUpperCase()}
						class="h-8 w-full rounded-lg p-1 px-2 font-rounded text-sm font-bold transition data-[team=BLUE]:bg-blue-600 data-[team=RED]:bg-amber-600 data-[team=BLUE]:hover:bg-blue-700 data-[team=RED]:hover:bg-amber-700 data-[team=BLUE]:active:bg-blue-800 data-[team=RED]:active:bg-amber-800"
					>
						{gameuser.team_name == team ? 'Leave' : 'Switch to'}
						{team.toUpperCase()} team
					</button>
				{/if}
			</div>
		{/if}
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
