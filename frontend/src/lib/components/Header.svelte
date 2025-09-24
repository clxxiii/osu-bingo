<script lang="ts">
	import IconRevealLink from './IconRevealLink.svelte';
	import NavLink from './NavLink.svelte';
	import User from './User.svelte';
	import VR from './VerticalRule.svelte';
</script>

<nav class="relative flex h-12 w-full items-center justify-between overflow-hidden p-1">
	<div class="flex h-full items-center">
		<a href="/" class="flex h-10 gap-1 rounded p-2 transition hover:bg-zinc-900">
			<img src="/icon.svg" class="h-6" alt="" />
			<div class="flex h-6 items-center text-nowrap font-rounded text-lg font-bold">BINGO</div>
		</a>
		<VR />
		<NavLink href="/">Home</NavLink>
		<NavLink href="/games">Games</NavLink>
		<!-- <NavLink href="/templates">Templates</NavLink> -->
	</div>
	<div class="flex h-full items-center">
		<div class="flex gap-1">
			<IconRevealLink text="github" href="/github" size={24}>
				<svg role="img" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<title>GitHub</title>
					<path
						d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
					/>
				</svg>
			</IconRevealLink>
			<IconRevealLink text="support" href="/support" size={24}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
					/>
				</svg>
			</IconRevealLink>
		</div>
		<VR />
		<User />
	</div>
</nav>
