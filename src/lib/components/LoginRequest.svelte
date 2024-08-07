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
	class="bg-zinc-800/80 sm:w-[400px] sm:max-h-[200px] p-6 sm:rounded-xl sm:shadow-xl w-full h-full"
>
	<h1 class="font-rounded font-bold text-2xl">Login Request</h1>
	<hr class="my-1 border-zinc-900 border-2 rounded" />
	<p class="pb-4">We can't fetch scores from you! Please try logging in again</p>
	<button
		class="font-rounded px-10 hover:bg-pink-900 transition active:bg-pink-950 font-bold bg-pink-800 border-pink-200 rounded-full p-1 w-full"
		on:click={login}>Log in</button
	>
</div>
