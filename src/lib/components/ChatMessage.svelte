<script lang="ts">
	import { fly } from 'svelte/transition';
	import PlayerChatMessage from './PlayerChatMessage.svelte';
	import ScoreChatMessage from './ScoreChatMessage.svelte';
	import UserChatMessage from './UserChatMessage.svelte';
	import {
		type GameUserEvent,
		type ChatMessage,
		isChatMessage,
		isGameUserUpdate,
		isSquareUpdate,
		type SquareUpdateEvent
	} from '$lib/events';
	export let event: ChatMessage | GameUserEvent | SquareUpdateEvent;
</script>

<div transition:fly={{ x: -30, duration: 100 }} class="w-full">
	{#if isChatMessage(event)}
		<UserChatMessage chat={event.data} />
	{:else if isSquareUpdate(event)}
		{#each event.data as score}
			<!-- <ScoreChatMessage {...score} /> -->
		{/each}
	{:else if isGameUserUpdate(event)}
		<PlayerChatMessage {event} />
	{/if}
</div>
