<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	onMount(() => {
		if (browser) window.close();
	});
</script>

You're now logged in, you can close this window!
