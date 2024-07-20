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
	class="h-8 mt-1 z-0 gap-2 p-1 rounded group transition hover:bg-zinc-800 w-full flex justify-between"
	target="_blank"
	rel="noopener noreferrer"
	href="https://osu.ppy.sh/u/{gameuser.user_id}"
>
	<img src={gameuser.user.avatar_url} class="size-6 rounded-full" alt="" />
	<span class="h-6 text-left mr-1 w-full col-start-2 col-end-3 flex items-center">
		{gameuser.user.username}
		{#if gameuser.host}
			<span class="p-1">
				<Crown class="text-yellow-600 size-4" />
			</span>
		{/if}
		<SquareArrowOutUpRight
			class="ml-1 text-transparent transition group-hover:text-zinc-400"
			size={12}
		/>
	</span>
	<span
		class="h-6 col-start-3 col-end-4 text-xs italic font-rounded text-zinc-600 flex items-center"
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
				class="w-0 z-10 h-6 group-hover:w-6 flex items-center justify-center hover:bg-zinc-900 hover:text-blue-400 rounded transition-all"
			>
				<ArrowRightLeft class="size-4" />
			</button>
		{/if}
	</span>
</a>
