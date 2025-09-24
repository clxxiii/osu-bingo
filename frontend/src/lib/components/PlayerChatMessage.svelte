<script lang="ts">
	import type { GameUserEvent } from '$lib/emitter';
	import { ArrowLeft, ArrowRight, ArrowRightLeft } from 'lucide-svelte';

	export let event: GameUserEvent;
</script>

<!-- {JSON.stringify(event)} -->
{#if event.data.type == 'join'}
	<div class="flex h-8 w-full px-4">
		<span class="text-green-700">
			<ArrowRight />
		</span>
		<a href="https://osu.ppy.sh/u/{event.data.user.user_id}" class="flex gap-1 pl-2">
			<img class="size-6 rounded-full" src={event.data.user.user.avatar_url} alt="" />
			{event.data.user.user.username}
		</a>
		<span class="pl-1">has joined</span>
		<span
			data-team={event.data.user.team_name.toLowerCase()}
			class="pl-1 font-bold data-[team=blue]:text-blue-600 data-[team=red]:text-amber-700"
		>
			{event.data.user.team_name.toLowerCase()} team
		</span>
	</div>
{:else if event.data.type == 'switch'}
	<div class="flex h-8 w-full px-4">
		<span class="text-blue-700">
			<ArrowRightLeft />
		</span>
		<a href="https://osu.ppy.sh/u/{event.data.user.user_id}" class="flex gap-1 pl-2">
			<img class="size-6 rounded-full" src={event.data.user.user.avatar_url} alt="" />
			{event.data.user.user.username}
		</a>
		<span class="pl-1">switched to</span>
		<span
			data-team={event.data.user.team_name.toLowerCase()}
			class="pl-1 font-bold data-[team=blue]:text-blue-600 data-[team=red]:text-amber-700"
		>
			{event.data.user.team_name.toLowerCase()} team
		</span>
	</div>
{:else if event.data.type == 'leave'}
	<div class="flex h-8 w-full px-4">
		<span class="text-red-700">
			<ArrowLeft />
		</span>
		<a href="https://osu.ppy.sh/u/{event.data.user.user_id}" class="flex gap-1 pl-2">
			<img class="size-6 rounded-full" src={event.data.user.user.avatar_url} alt="" />
			{event.data.user.user.username}
		</a>
		<span class="pl-1">left the game</span>
	</div>
{/if}
