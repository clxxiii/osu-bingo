<script lang="ts">
	import { fly } from 'svelte/transition';
	import PlayerChatMessage from './PlayerChatMessage.svelte';
	import UserChatMessage from './UserChatMessage.svelte';
	import {
		type GameUserEvent,
		type ChatMessage,
		isChatMessage,
		isGameUserUpdate,
		type SquareUpdateEvent
	} from '$lib/emitter';
	export let event: ChatMessage | GameUserEvent | SquareUpdateEvent;
</script>

<div transition:fly={{ x: -30, duration: 100 }} class="w-full">
	{#if isChatMessage(event)}
		<UserChatMessage chat={event.data} />
	{:else if isGameUserUpdate(event)}
		<PlayerChatMessage {event} />
	{/if}
</div>
