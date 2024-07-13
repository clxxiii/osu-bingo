<script lang="ts">
	import type {
		ChatEvent,
		ChatMessage,
		ScoreMessage,
		PlayerMessage
	} from '$lib/server/game/chat_emitter';
	import { fly } from 'svelte/transition';
	import PlayerChatMessage from './PlayerChatMessage.svelte';
	import ScoreChatMessage from './ScoreChatMessage.svelte';
	import UserChatMessage from './UserChatMessage.svelte';
	export let event: ChatEvent;

	const isChatEvent = (event: ChatEvent): event is ChatMessage => {
		return event.type == 'chat';
	};

	const isScoreEvent = (event: ChatEvent): event is ScoreMessage => {
		return event.type == 'score';
	};

	const isPlayerEvent = (event: ChatEvent): event is PlayerMessage => {
		return event.type == 'player';
	};
</script>

<div transition:fly={{ x: -30, duration: 100 }} class="w-full">
	{#if isChatEvent(event)}
		<UserChatMessage chat={event.data} />
	{:else if isScoreEvent(event)}
		{#each event.data as score}
			<ScoreChatMessage {score} />
		{/each}
	{:else if isPlayerEvent(event)}
		<PlayerChatMessage {event} />
	{/if}
</div>
