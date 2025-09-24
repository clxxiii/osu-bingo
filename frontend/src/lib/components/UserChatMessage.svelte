<script lang="ts">
	import { Crown } from 'lucide-svelte';
	import DeveloperBadge from './DeveloperBadge.svelte';

	export let chat: Bingo.Card.FullChat;

	const time = new Date(chat.time).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	});
</script>

<div class="group relative w-full p-1 px-3 hover:bg-[rgba(0,0,0,0.2)]">
	<DeveloperBadge id={chat.user.user_id} />
	{#if chat.user.host}
		<Crown class="group inline size-4 text-yellow-600" />
		<span></span>
	{/if}
	<img src={chat.user.user.avatar_url} class="inline h-6 rounded-full" alt="" />
	<span class="font-bold">{chat.user.user.username}: </span>
	{chat.text}
	<div
		class="invisible absolute bottom-0 right-0 select-none p-1 font-rounded text-xs text-zinc-700 group-hover:visible"
	>
		{time}
	</div>
</div>
