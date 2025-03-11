<script lang="ts">
	import { MessageSquareText } from 'lucide-svelte';
	import ChatMessage from './ChatMessage.svelte';
	import { chats } from '$lib/stores';
	import { afterUpdate } from 'svelte';

	export let channel = 'global';

	// Autoscroll
	let box: HTMLDivElement;
	const scrollToBottom = () => {
		if (!box) return;

		box.scroll({
			top: box.scrollHeight,
			behavior: 'smooth'
		});
	};
	afterUpdate(scrollToBottom);

	export let enabled: boolean = false;

	let input: HTMLInputElement;
	const keydown = async (ev: KeyboardEvent) => {
		if (ev.key != 'Enter') return;

		const body = new FormData();
		body.set('message', input.value);
		body.set('channel', channel.toUpperCase());

		input.disabled = true;
		const result = await fetch('?/chat', {
			method: 'POST',
			body
		});
		if (result.ok) {
			input.value = '';
		}
		input.disabled = false;
		input.focus();
	};
</script>

<div
	class="relative grid size-full grid-rows-[3rem_calc(100%-3rem-4.5rem)_4.5rem] rounded-xl bg-zinc-800"
>
	<h1
		data-channel={channel}
		class="flex h-12 w-full items-center gap-x-1 rounded-t-xl bg-zinc-800 p-2 font-rounded text-2xl font-bold capitalize shadow data-[channel=blue]:bg-blue-700 data-[channel=red]:bg-amber-700"
	>
		<MessageSquareText size={36} /> <span>{channel ?? 'Global'} Chat</span>
	</h1>
	<div bind:this={box} class="overflow-y-scroll">
		<div class="flex flex-col items-center justify-end overflow-x-hidden">
			<div class="p-2 text-zinc-500">
				{#if enabled}
					<div>Welcome to the chatroom!</div>
				{/if}
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
				bind:this={input}
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
