<script lang="ts">
	export let chat: Bingo.Card.FullChat;

	const time = new Date(chat.time).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	});
</script>

<div class="group w-full p-1 px-3 hover:bg-[rgba(0,0,0,0.2)] relative">
	<img src={chat.user.avatar_url} class="inline h-6 rounded-full" alt="" />
	<span class="font-bold">{chat.user.username}: </span>
	{chat.text}
	<div
		class="absolute bottom-0 right-0 p-1 text-xs text-zinc-700 invisible group-hover:visible font-rounded"
	>
		{time}
	</div>
</div>
