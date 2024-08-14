<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
  import { listener, game_id } from "$lib/stores";
	import { isInit, type EmitterEvent } from '$lib/emitter';
	import { source } from 'sveltekit-sse';
	import { updateGame } from '$lib/emitter/updater';

	export let data: PageData;
	const user = data.user;

  onMount(async () => {

  const params = new URLSearchParams();
  if ($game_id) params.set("game_id", $game_id);
  const stream = source(`/game_stream?${params.toString()}`, {
    close: ({ connect }) => {
      listener.set(null)
      setTimeout(() => {
        connect();
      }, 2000)
    }
  })
  stream.select('message').subscribe((msg: string) => {
    let event: EmitterEvent | null = null;
    try {
      event = JSON.parse(msg);
    } catch {
      return;
    }
    if (!event) return;

    if (isInit(event)) listener.set(event.data.id);
    console.log(event);
    updateGame(event);
  });
});
</script>

<header class="bg-zinc-800 shadow">
	<Header {user} />
</header>
<main class="relative min-h-full p-4">
	<slot />
</main>
<footer class="bg-zinc-800">
	<Footer />
</footer>
