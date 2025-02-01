<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let color: string = '#fff';
	export let min = 0;
	export let max = 100;
	export let selected_min = 40;
	export let selected_max = 50;
	export let difference = 5;
	export let decimals = 2;

	export let disabled;

	// For  showing the value, what to divide by
	export let divisor = 1;

	const dispatch = createEventDispatcher();

	export const minChange = (change: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		const value = parseInt(change.currentTarget.value);
		if (selected_max - difference <= value) {
			change.currentTarget.value = `${selected_max - difference}`;
		}
	};

	export const maxChange = (change: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		const value = parseInt(change.currentTarget.value);
		if (selected_min + difference >= value) {
			change.currentTarget.value = `${selected_min + difference}`;
		}
	};

	const update = () => {
		dispatch('update', { min: selected_min, max: selected_max });
	};
</script>

<div style="--c: {disabled ? '#888' : color}">
	<div class="rounded-full bg-zinc-900 p-1">
		<div class="group relative h-4">
			<input
				on:change={update}
				on:input={minChange}
				bind:value={selected_min}
				{disabled}
				class="absolute left-0 top-[50%] z-10 transition group-hover:brightness-125"
				type="range"
				{min}
				{max}
			/>
			<input
				on:change={update}
				on:input={maxChange}
				bind:value={selected_max}
				class="absolute left-0 top-[50%] z-10 transition group-hover:brightness-125"
				{disabled}
				type="range"
				{min}
				{max}
			/>
			<div
				style="--l: calc({(selected_min * 100) / (max - min)}% - {selected_min /
					(max - min)} * 1rem + 0.5rem); --w: calc({((selected_max - selected_min) * 100) /
					(max - min)}% - {(selected_max - selected_min) / (max - min)} * 1rem)"
				class="absolute left-[var(--l)] z-0 h-full w-[var(--w)] bg-[var(--c)]"
			></div>
		</div>
	</div>
	<div class="flex justify-between px-1">
		<span>
			{(selected_min / divisor).toFixed(decimals)}
		</span>
		<span>
			{(selected_max / divisor).toFixed(decimals)}
		</span>
	</div>
</div>

<style>
	input[type='range'] {
		appearance: none;
		height: 0px;
		width: 100%;
		pointer-events: none;
	}
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		pointer-events: all;
		width: 1rem;
		height: 1rem;
		background-color: var(--c);
		border: 0;
		border-radius: 50%;
		cursor: pointer;
	}
	input[type='range']::-moz-range-thumb {
		-webkit-appearance: none;
		appearance: none;
		pointer-events: all;
		width: 1rem;
		height: 1rem;
		background-color: var(--c);
		border: 0;
		border-radius: 50%;
		cursor: pointer;
	}
</style>
