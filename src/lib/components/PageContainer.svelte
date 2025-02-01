<script lang="ts">
	import { fade, fly } from 'svelte/transition';
</script>

<div class="absolute left-0 top-0 w-full overflow-hidden">
	<div
		class="relative bottom-0 left-0 top-0 w-full"
		in:fly={{ duration: 300, x: 100 }}
		out:fly={{ duration: 300, x: -100 }}
	>
		<slot />
	</div>
</div>
