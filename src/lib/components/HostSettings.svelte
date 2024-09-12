<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import ToggleSwitch from './ToggleSwitch.svelte';
	import NumberScale from './NumberScale.svelte';

	export let store: Writable<Bingo.Card>;

	const changeVisibility = async (is_public: boolean) => {
		const body = new FormData();
		body.set('public', `${is_public}`);
		await fetch('?/change_settings', {
			method: 'POST',
			body
		});
	};

	const changeStarRating = async (min: number, max: number) => {
		min = min / 10;
		max = max / 10;
		const body = new FormData();
		body.set('min_sr', `${min}`);
		body.set('max_sr', `${max}`);
		await fetch('?/change_settings', {
			method: 'POST',
			body
		});
	};

	const changeLength = async (min: number, max: number) => {
		const body = new FormData();
		body.set('min_length', `${min}`);
		body.set('max_length', `${max}`);
		await fetch('?/change_settings', {
			method: 'POST',
			body
		});
	};
</script>

<div class="absolute top-0 right-0 min-w-[300px] h-full rounded-r-xl overflow-hidden">
	<div transition:slide={{ axis: 'x' }} class="absolute right-0 w-full h-full bg-zinc-800 p-2">
		<h1 class="font-rounded text-2xl pt-4 pb-4 text-center font-bold">Host Settings</h1>
		<div
			class="bg-zinc-900/50 flex mb-4 items-center font-rounded uppercase font-bold flex-col w-full p-2 rounded-lg"
		>
			Game Visibility
			<div class="w-full max-w-[200px] pt-1">
				<ToggleSwitch
					onText="Public"
					onColor="#16a34a"
					offColor="#755780"
					offText="Private"
					on:update={(e) => changeVisibility(e.detail)}
					toggle={$store.public}
				/>
			</div>
		</div>
		<div
			class="bg-zinc-900/50 mb-4 flex items-center font-rounded uppercase font-bold flex-col w-full p-2 rounded-lg"
		>
			Star Rating
			<div class="w-full pt-1">
				<NumberScale
					color="#ee92c2"
					selected_min={($store.min_sr ?? 4) * 10}
					selected_max={($store.max_sr ?? 5) * 10}
					divisor={10}
					on:update={(e) => changeStarRating(e.detail.min, e.detail.max)}
				/>
			</div>
		</div>
		<div
			class="bg-zinc-900/50 bg-yellow-200 flex items-center font-rounded uppercase font-bold flex-col w-full p-2 rounded-lg"
		>
			Map Length
			<div class="w-full pt-1">
				<NumberScale
					color="#fef08a"
					max={600}
					selected_min={$store.min_length ?? 30}
					selected_max={$store.max_length ?? 200}
					decimals={0}
					on:update={(e) => changeLength(e.detail.min, e.detail.max)}
				/>
			</div>
		</div>
	</div>
</div>
