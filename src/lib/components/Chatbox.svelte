<script lang="ts">
	import { MessageSquareText } from 'lucide-svelte';
	import ChatMessage from './ChatMessage.svelte';
	import { chats } from '$lib/stores';

	export let channel = 'global';

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

	export let enabled: boolean = false;

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
	class="relative grid size-full grid-rows-[3rem_calc(100%-3rem-4.5rem)_4.5rem] rounded-xl bg-zinc-800"
>
	<h1
		data-channel={channel}
		class="flex h-12 w-full items-center gap-x-1 rounded-t-xl bg-zinc-800 p-2 font-rounded text-2xl font-bold capitalize shadow data-[channel=blue]:bg-blue-700 data-[channel=red]:bg-amber-700"
	>
		<MessageSquareText size={36} /> <span>{channel} Chat</span>
	</h1>
	<div use:scroll={chatLength} class="overflow-y-scroll">
		<div class="flex flex-col items-center justify-end overflow-x-hidden">
			<div class="p-2 text-zinc-500">
				<div>Welcome to the chatroom!</div>
				{#if channel.toUpperCase() != 'GLOBAL'}
					<div>Use this channel to collaborate with your fellow teammates!</div>
				{/if}
			</div>
			{#each $chats as event}
				<ChatMessage {event} />
			{/each}
		</div>
	</div>
	{#if enabled}
		<div class="w-full p-5">
			<input
				type="text"
				bind:this={box}
				on:keydown={keydown}
				placeholder="Send a message"
				class="block w-full rounded-full bg-zinc-700 p-2 text-sm outline-none transition focus:shadow-lg disabled:bg-zinc-800"
			/>
		</div>
	{:else}
		<div class="w-full p-5">
			<input
				type="text"
				disabled
				placeholder="Join the game to chat"
				class="block w-full rounded-full bg-zinc-700/50 p-2 text-sm outline-none focus:shadow-lg"
			/>
		</div>
	{/if}
</div>
