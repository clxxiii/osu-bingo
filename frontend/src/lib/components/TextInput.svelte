<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { FormEventHandler } from 'svelte/elements';

	export let submitDelay = 300;
	export let limit = 999;
	export let allowBlank = false;
	export let value: string;

	const dispatch = createEventDispatcher();

	let timer: Timer;
	const input: FormEventHandler<HTMLInputElement> = (ev) => {
		const value = ev.currentTarget.value;
		if (value.length > limit) {
			ev.currentTarget.value = ev.currentTarget.value.slice(0, limit);
			return;
		}

		if (!allowBlank && value == '') return;

		clearTimeout(timer);
		timer = setTimeout(() => dispatch('change', value), submitDelay);
	};
</script>

<input
	type="text"
	on:input={input}
	{value}
	class="text-s h-10 w-full rounded-lg border-[1px] border-zinc-700 bg-zinc-900 px-2 font-rounded outline-none transition-all focus:border-2 focus:border-zinc-600"
/>
