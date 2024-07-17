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
	class="relative w-full grid grid-cols-2 grid-rows-1 h-10 bg-zinc-900 rounded-lg"
	style="--color: {toggle ? onColor : offColor}"
>
	<input
		on:click={cooldown}
		class="z-20 peer cursor-pointer absolute h-full w-full appearance-none"
		type="checkbox"
		bind:this={checkbox}
		bind:checked={toggle}
	/>
	<div
		class="h-full select-none peer-checked:text-zinc-800 transition flex items-center justify-center font-bold font-rounded uppercase z-10"
	>
		{offText}
	</div>
	<div
		class="h-full select-none peer-checked:text-purple-300 text-zinc-800 transition flex items-center justify-center font-bold font-rounded uppercase z-10"
	>
		{onText}
	</div>
	<div
		class="transition-all rounded-lg absolute peer-checked:left-[50%] left-[0%] top-0 h-10 w-1/2 bg-[var(--color)]"
	></div>
</div>
