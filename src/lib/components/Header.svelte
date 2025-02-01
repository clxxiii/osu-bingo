<script lang="ts">
	import NavLink from './NavLink.svelte';
	import User from './User.svelte';
	import VR from './VerticalRule.svelte';
</script>

<nav class="relative flex h-12 w-full items-center overflow-hidden p-1">
	<a href="/" class="flex h-10 gap-1 rounded p-2 transition hover:bg-zinc-900">
		<img src="/icon.svg" class="h-6" alt="" />
		<div class="flex h-6 items-center text-nowrap font-display text-lg">bingo</div>
	</a>
	<VR />
	<NavLink href="/">Home</NavLink>
	<NavLink href="/games">Games</NavLink>
	<!-- <NavLink href="/templates">Templates</NavLink> -->
	<div class="absolute right-1">
		<User />
	</div>
</nav>
