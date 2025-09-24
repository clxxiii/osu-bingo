<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { source } from 'sveltekit-sse';
	import { isGameUserUpdate, isInit, isStateUpdate, type EmitterEvent } from '$lib/emitter';
	import { updateGame } from '$lib/emitter/updater';
	import { blur } from 'svelte/transition';
	import Board from '$lib/components/overlays/Board.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';

	export let data: PageData;

	let { game_id, user_id, settings } = data;
	let listener_id: string | null = null;

	const startListening = () => {
		if (!game_id) return;

		const params = new URLSearchParams();
		const stream = source(`/game_stream?${params.toString()}`);

		stream.select('message').subscribe((msg: string) => {
			let event: EmitterEvent | null = null;
			try {
				event = JSON.parse(msg);
			} catch {
				return;
			}
			if (!event) return;

			if (isStateUpdate(event)) {
				if (event.data.state == 2) {
					setTimeout(() => {
						game_id = null;
						fetch(`/game_stream/change_game?id=${listener_id}`, {
							method: 'POST'
						});
					}, 30 * 1000);
				}
			}

			if (isGameUserUpdate(event)) {
				if (event.data.type == 'leave' && event.data.user.user_id == user_id) {
					game_id = null;
					fetch(`/game_stream/change_game?id=${listener_id}`, {
						method: 'POST'
					});
				}
			}

			if (isInit(event)) {
				listener_id = event.data.id;
				fetch(`/game_stream/change_game?id=${listener_id}&game_id=gam_${game_id}`, {
					method: 'POST'
				});
			}
			console.log(event);
			updateGame(event);
		});
	};

	onMount(async () => {
		if (user_id) {
			setInterval(async () => {
				if (game_id) return;

				const params = new URLSearchParams();
				params.set('user_id', `${user_id}`);
				const userReq = await fetch(`/get_user_game?${params.toString()}`);
				const user = await userReq.json();
				if (!user.game_id) {
					game_id = null;
					return;
				}
				game_id = user.game_id.substring(4);
				if (listener_id) {
					fetch(`/game_stream/change_game?id=${listener_id}&game_id=gam_${game_id}`, {
						method: 'POST'
					});
				}
				startListening();
			}, 2000);
		}

		if (game_id) {
			startListening();
		}
	});
</script>

<div style="--s: {settings.scale}" class="relative size-[400px] origin-top-left scale-[var(--s)]">
	{#if game_id}
		<div class="absolute size-full" transition:blur={{ duration: 500 }}>
			<Board {settings} />
		</div>
	{:else}
		<div
			class="absolute flex size-full flex-col items-center justify-center rounded-xl bg-base-800/50"
			transition:blur={{ duration: 500 }}
		>
			<div class="mb-10 font-rounded text-xl font-bold text-white">
				Waiting for user to enter a game
			</div>
			<LoadingIcon size={50} />
		</div>
	{/if}
</div>
