<script lang="ts">
	import { ArrowRightLeft, Crown, SquareArrowOutUpRight } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import DeveloperBadge from './DeveloperBadge.svelte';

	export let movable: boolean;
	const move = async (ev: MouseEvent) => {
		// Prevent from opening user page
		ev.preventDefault();

		const currentTeam = gameuser.team_name;
		const nextTeam = currentTeam == 'RED' ? 'BLUE' : 'RED';
		const data = new FormData();
		data.set('user_id', gameuser.id);
		data.set('team', nextTeam);
		await fetch(`?/switch_team`, {
			body: data,
			method: 'POST'
		});
	};

	export let gameuser: Bingo.Card.FullUser;
</script>

<a
	transition:fly={{ duration: 250, y: 0, x: -100 }}
	class="group z-0 mt-1 flex h-8 w-full justify-between gap-2 rounded p-1 transition hover:bg-zinc-800"
	target="_blank"
	rel="noopener noreferrer"
	href="https://osu.ppy.sh/u/{gameuser.user_id}"
>
	<img src={gameuser.user.avatar_url} class="size-6 rounded-full" alt="" />
	<span class="col-start-2 col-end-3 mr-1 flex h-6 w-full items-center text-left">
		<div class="flex w-full items-center overflow-hidden whitespace-nowrap">
			{gameuser.user.username}
			<SquareArrowOutUpRight
				class="ml-1 text-transparent transition group-hover:text-zinc-400"
				size={12}
			/>
		</div>
		{#if gameuser.host}
			<span class="p-1">
				<Crown class="size-4 text-yellow-600" />
			</span>
		{/if}
	</span>
	<span
		class="col-start-3 col-end-4 flex h-6 items-center font-rounded text-xs italic text-zinc-600"
	>
		{#if gameuser.user.global_rank}
			<span class="p-1">
				#{gameuser.user.global_rank.toLocaleString()}
			</span>
		{/if}
		<DeveloperBadge id={gameuser.user_id} />
		{#if movable}
			<button
				on:click={move}
				class="z-10 flex h-6 w-0 items-center justify-center rounded transition-all hover:bg-zinc-900 hover:text-blue-400 group-hover:w-6"
			>
				<ArrowRightLeft class="size-4" />
			</button>
		{/if}
	</span>
</a>
