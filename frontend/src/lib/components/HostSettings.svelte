<script lang="ts">
	import { game as store, game_rules } from '$lib/stores';
	import ToggleSwitch from './ToggleSwitch.svelte';
	import NumberScale from './NumberScale.svelte';
	import Invite from './Invite.svelte';
	import DeleteButton from './DeleteButton.svelte';

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

	const start = async () => {
		const data = new FormData();
		await fetch(`?/start_game`, {
			body: data,
			method: 'POST'
		});
	};
</script>

<div class="absolute right-0 top-0 h-full w-full overflow-hidden rounded-xl bg-zinc-800">
	<div class="absolute right-0 h-full w-full p-2">
		{#if $store}
			<h1 class="pb-4 pt-4 text-center font-rounded text-2xl font-bold">Host Settings</h1>
			<div class="flex gap-4">
				<div
					class="mb-4 flex w-full flex-col items-center rounded-lg bg-zinc-900/50 p-2 font-rounded font-bold uppercase"
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

				<div class="mb-4 flex w-full">
					<Invite hidden={!$store?.public} linkCode={$store?.link_id ?? ''} />
				</div>
			</div>
			<div
				data-disabled={$store.state != 0}
				class="mb-4 flex w-full flex-col items-center rounded-lg bg-zinc-900/50 p-2 font-rounded font-bold uppercase data-[disabled=true]:text-base-600"
			>
				Star Rating
				<div class="w-full pt-1">
					<NumberScale
						color="#ee92c2"
						selected_min={($game_rules?.stars?.min ?? 4) * 10}
						selected_max={($game_rules?.stars?.max ?? 5) * 10}
						disabled={$store.state != 0}
						divisor={10}
						on:update={(e) => changeStarRating(e.detail.min, e.detail.max)}
					/>
				</div>
			</div>
			<div
				data-disabled={$store.state != 0}
				class="flex w-full flex-col items-center rounded-lg bg-yellow-200 bg-zinc-900/50 p-2 font-rounded font-bold uppercase data-[disabled=true]:text-base-600"
			>
				Map Length
				<div class="w-full pt-1">
					<NumberScale
						color="#fef08a"
						max={600}
						selected_min={$game_rules?.length?.min ?? 30}
						selected_max={$game_rules?.length?.max ?? 200}
						disabled={$store.state != 0}
						decimals={0}
						on:update={(e) => changeLength(e.detail.min, e.detail.max)}
					/>
				</div>
			</div>
			{#if $store?.state == 0}
				<button
					on:click={start}
					class="mt-4 w-full rounded-full bg-green-600 p-1 px-2 font-rounded text-xl font-bold hover:bg-green-700 active:bg-green-900"
				>
					START GAME</button
				>
			{/if}

			<div class="absolute bottom-0 w-full p-4 pl-0">
				<DeleteButton />
			</div>
		{/if}
	</div>
</div>
