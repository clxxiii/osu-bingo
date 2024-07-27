<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import ToggleSwitch from './ToggleSwitch.svelte';

	export let store: Writable<Bingo.Card>;

	const changeVisibility = async (is_public: boolean) => {
		const body = new FormData();
		body.set('public', `${is_public}`);
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
			class="bg-zinc-900/50 flex items-center font-rounded uppercase font-bold flex-col w-full p-2 rounded-lg"
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
	</div>
</div>
