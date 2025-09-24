<script>
	import { page } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { user } from '$lib/stores';
	import './(main)/app.css';

	export let data;
	user.set(data.user);
</script>

<svelte:head>
	<title>
		{$page.status}: {$page.error?.message}
	</title>
</svelte:head>

<header class="bg-zinc-800 shadow">
	<Header />
</header>
<main class="relative min-h-full p-4">
	{$page.status}: {$page.error?.message}
</main>
<footer class="bg-zinc-800">
	<Footer />
</footer>
