<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const user = data.user;
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
