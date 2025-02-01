<script>
	import { goto } from '$app/navigation';
	import { sendToast } from '$lib/toast';
	import { onMount } from 'svelte';

	onMount(() => {
		sendToast("Couldn't find that game!");
		goto('/games');
	});
</script>
