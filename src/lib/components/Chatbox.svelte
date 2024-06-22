<script lang="ts">
	import { MessageSquareText } from 'lucide-svelte';
	import type { Writable } from 'svelte/store';
	import ChatMessage from './ChatMessage.svelte';
	import { onMount } from 'svelte';

	export let channel = 'global';
	export let store: Writable<Bingo.Card>;

	let chats: Bingo.Card.FullChat[] = [];
	onMount(() => {
		store.subscribe((game) => {
			if (!game) return;
			chats = game.chats.filter((x) => x.channel?.toUpperCase() == channel?.toUpperCase());
		});
	});

	let box: HTMLInputElement;
	const keydown = async (ev: KeyboardEvent) => {
		if (ev.key != 'Enter') return;

		const body = new FormData();
		body.set('message', box.value);
		body.set('channel', channel.toUpperCase());

		box.disabled = true;
		const result = await fetch('?/chat', {
			method: 'POST',
			body
		});
		if (result.ok) {
			box.value = '';
		}
		box.disabled = false;
	};
</script>

<div
	class="bg-zinc-800 relative rounded-xl size-full grid grid-rows-[3rem_calc(100%-3rem-4.5rem)_4.5rem]"
>
	<h1
		class="items-center h-12 capitalize rounded-t-xl flex bg-zinc-800 gap-x-1 w-full text-2xl font-rounded shadow font-bold p-2"
	>
		<MessageSquareText size={36} /> <span>{channel} Chat</span>
	</h1>
	<div class="overflow-y-scroll">
		<div class="flex flex-col justify-end items-center">
			{#key chats}
				{#each chats as chat}
					<ChatMessage {chat} />
				{/each}
			{/key}
		</div>
	</div>
	<div class="p-5 w-full">
		<input
			type="text shadow"
			bind:this={box}
			on:keydown={keydown}
			placeholder="Send a message"
			class="text-sm disabled:bg-zinc-800 transition bg-zinc-700 p-2 rounded-full outline-none focus:shadow-lg block w-full shadow"
		/>
	</div>
</div>
