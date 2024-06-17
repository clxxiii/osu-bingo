<script lang="ts">
	import User from './User.svelte';
	import VR from './VerticalRule.svelte';

	export let user: Bingo.User | undefined;
</script>

<nav class="relative h-12 w-full flex items-center p-1">
	<a href="/" class="h-10 p-2 hover:bg-zinc-900 flex gap-1 rounded transition">
		<img src="/icon.svg" class="h-6" alt="" />
		<div class="flex items-center font-display h-6 text-lg text-nowrap">bingo</div>
	</a>
	<VR />
	<div class="absolute right-1">
		<User {user} />
	</div>
</nav>
