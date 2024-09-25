<script>
	import { fly } from 'svelte/transition';

	const login = () => {
		window.open(
			'/auth/login/osu?from=/login_request',
			'Log in to osu!',
			'width=600,height=800,top=200,location=no,toolbar=no'
		);
	};
</script>

<div
	transition:fly={{ delay: 500, y: 50, duration: 300 }}
	class="h-full w-full bg-zinc-800/80 p-6 sm:max-h-[200px] sm:w-[400px] sm:rounded-xl sm:shadow-xl"
>
	<h1 class="font-rounded text-2xl font-bold">Login Request</h1>
	<hr class="my-1 rounded border-2 border-zinc-900" />
	<p class="pb-4">We can't fetch scores from you! Please try logging in again</p>
	<button
		class="w-full rounded-full border-pink-200 bg-pink-800 p-1 px-10 font-rounded font-bold transition hover:bg-pink-900 active:bg-pink-950"
		on:click={login}>Log in</button
	>
</div>
