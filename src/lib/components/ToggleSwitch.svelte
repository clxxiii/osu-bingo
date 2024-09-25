<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let toggle: boolean = false;

	export let onText = 'Yes';
	export let onColor = '#16a34a';

	export let offText = 'No';
	export let offColor = '#b13e24';

	export let cooldownMS = 300;

	let checkbox: HTMLInputElement;
	const dispatch = createEventDispatcher();

	let cooled = false;
	const cooldown = (ev: MouseEvent) => {
		if (cooled) {
			ev.preventDefault();
			return;
		}

		cooled = true;
		dispatch('update', checkbox.checked);
		setTimeout(() => (cooled = false), cooldownMS);
	};
</script>

<div
	class="relative grid h-10 w-full grid-cols-2 grid-rows-1 rounded-lg bg-zinc-900"
	style="--color: {toggle ? onColor : offColor}"
>
	<input
		on:click={cooldown}
		class="peer absolute z-20 h-full w-full cursor-pointer appearance-none"
		type="checkbox"
		bind:this={checkbox}
		bind:checked={toggle}
	/>
	<div
		class="z-10 flex h-full select-none items-center justify-center font-rounded font-bold uppercase transition peer-checked:text-zinc-800"
	>
		{offText}
	</div>
	<div
		class="z-10 flex h-full select-none items-center justify-center font-rounded font-bold uppercase text-zinc-800 transition peer-checked:text-purple-300"
	>
		{onText}
	</div>
	<div
		class="absolute left-[0%] top-0 h-10 w-1/2 rounded-lg bg-[var(--color)] transition-all peer-checked:left-[50%]"
	></div>
</div>
