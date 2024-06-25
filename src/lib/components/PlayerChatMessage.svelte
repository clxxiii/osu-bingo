<script lang="ts">
	import type { PlayerMessage } from '$lib/server/game/chat_emitter';
	import { ArrowLeft, ArrowRight, ArrowRightLeft } from 'lucide-svelte';

	export let event: PlayerMessage;
</script>

<!-- {JSON.stringify(event)} -->
{#if event.data.action == 'join'}
	<div class="w-full h-8 px-4 flex">
		<span class="text-green-700">
			<ArrowRight />
		</span>
		<a href="https://osu.ppy.sh/u/{event.data.player.user_id}" class="pl-2 flex gap-1">
			<img class="size-6 rounded-full" src={event.data.player.user.avatar_url} alt="" />
			{event.data.player.user.username}
		</a>
		<span class="pl-1">has joined</span>
		<span
			data-team={event.data.player.team_name.toLowerCase()}
			class="pl-1 font-bold data-[team=red]:text-amber-700 data-[team=blue]:text-blue-600"
		>
			{event.data.player.team_name.toLowerCase()} team
		</span>
	</div>
{:else if event.data.action == 'switch'}
	<div class="w-full h-8 px-4 flex">
		<span class="text-blue-700">
			<ArrowRightLeft />
		</span>
		<a href="https://osu.ppy.sh/u/{event.data.player.user_id}" class="pl-2 flex gap-1">
			<img class="size-6 rounded-full" src={event.data.player.user.avatar_url} alt="" />
			{event.data.player.user.username}
		</a>
		<span class="pl-1">switched to</span>
		<span
			data-team={event.data.player.team_name.toLowerCase()}
			class="pl-1 font-bold data-[team=red]:text-amber-700 data-[team=blue]:text-blue-600"
		>
			{event.data.player.team_name.toLowerCase()} team
		</span>
	</div>
{:else if event.data.action == 'leave'}
	<div class="w-full h-8 px-4 flex">
		<span class="text-red-700">
			<ArrowLeft />
		</span>
		<a href="https://osu.ppy.sh/u/{event.data.player.user_id}" class="pl-2 flex gap-1">
			<img class="size-6 rounded-full" src={event.data.player.user.avatar_url} alt="" />
			{event.data.player.user.username}
		</a>
		<span class="pl-1">left the game</span>
	</div>
{/if}
