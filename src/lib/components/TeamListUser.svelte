<script lang="ts">
	import { SquareArrowOutUpRight } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	export let user: Bingo.Card.FullUser;
</script>

<a
	transition:fly={{ duration: 250, y: 0, x: -100 }}
	class="h-8 mt-1 gap-2 p-1 rounded group transition hover:bg-zinc-800 w-full flex justify-between"
	target="_blank"
	rel="noopener noreferrer"
	href="https://osu.ppy.sh/u/{user.id}"
>
	<img src={user.avatar_url} class="size-6 rounded-full" alt="" />
	<span class="h-6 text-left w-full col-start-2 col-end-3 flex items-center">
		{user.username}
		<SquareArrowOutUpRight
			class="ml-1 text-transparent transition group-hover:text-zinc-400"
			size={12}
		/>
	</span>
	<span
		class="h-6 col-start-3 col-end-4 text-xs italic font-rounded text-zinc-600 flex items-center"
	>
		{#if user.global_rank}
			#{user.global_rank.toLocaleString()}
		{/if}
	</span>
</a>
