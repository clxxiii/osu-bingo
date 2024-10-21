<script lang="ts">
	import '../../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { listener, user } from '$lib/stores';
	import { isInit, type EmitterEvent } from '$lib/emitter';
	import { source } from 'sveltekit-sse';
	import { updateGame } from '$lib/emitter/updater';

	export let data: PageData;
	user.set(data.user);

	onMount(async () => {
		const params = new URLSearchParams();
		const stream = source(`/game_stream?${params.toString()}`, {
			close: ({ connect }) => {
				listener.set(null);
				setTimeout(() => {
					connect();
				}, 2000);
			}
		});
		stream.select('message').subscribe((msg: string) => {
			let event: EmitterEvent | null = null;
			try {
				event = JSON.parse(msg);
			} catch {
				return;
			}
			if (!event) return;

			if (isInit(event)) {
				listener.set(event.data.id);

				// Switch listener immediately if we're on a game page
				if (data.game_id) {
					fetch(`/game_stream/change_game?id=${event.data.id}&game_id=gam_${data.game_id}`, {
						method: 'POST'
					});
				}
			}
			console.log(event);
			updateGame(event);
		});
	});
</script>

<header class="bg-zinc-800 shadow">
	<Header />
</header>
<main class="relative min-h-full p-4">
	<slot />
</main>
<footer class="bg-zinc-800">
	<Footer />
</footer>
