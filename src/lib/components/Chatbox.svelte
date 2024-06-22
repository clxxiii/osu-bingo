<script lang="ts">
	import { MessageSquareText } from 'lucide-svelte';
	import ChatMessage from './ChatMessage.svelte';
	import type { ChatEvent } from '$lib/server/game/chat_emitter';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';

	export let channel = 'global';
	export let game_id: string;

	let chats = writable<Bingo.Card.FullChat[]>([]);
	let chatLength = 0;
	const scroll = (node: HTMLDivElement, chatLength: number) => {
		const scroll = () => scrollToBottom(node);
		scroll();

		return { update: scroll };
	};

	const scrollToBottom = (node: HTMLDivElement) => {
		node.scroll({
			top: node.scrollHeight,
			behavior: 'smooth'
		});
	};

	let chatStream: EventSource;

	$: {
		if (browser) {
			chatStream = new EventSource(`/chat_stream/${game_id}/${channel}`);
			chatStream.onmessage = (msg) => {
				const event: ChatEvent = JSON.parse(msg.data);
				console.log(event);
				chats.update((chats) => {
					if (event.type == 'fullUpdate') chats = event.data;
					else chats.push(event.data);
					chatLength = chats.length;

					return chats;
				});
			};
			chatStream.onerror = console.log;
		}
	}
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
	<div use:scroll={chatLength} class="overflow-y-scroll">
		<div class="flex flex-col justify-end items-center">
			{#each $chats as chat}
				<ChatMessage {chat} />
			{/each}
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
