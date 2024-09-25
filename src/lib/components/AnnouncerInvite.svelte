<script lang="ts">
	import { browser } from '$app/environment';
	import { Eye, EyeOff } from 'lucide-svelte';

	export let linkCode: string | null;
	export let hidden = false;

	let origin = 'bingourl';
	if (browser) {
		origin = window.location.origin;
	}

	const copy = () => {
		const url = `${origin}/${linkCode}`;

		if (browser) {
			navigator.clipboard.writeText(url);
		}
	};
</script>

<div class="h-full w-[250px] rounded-lg bg-zinc-900/50 p-2">
	<div class="w-full">Click to Copy</div>
	<div class="flex h-8 rounded-lg border-[1px] border-zinc-700 bg-zinc-900">
		<button
			class="flex size-8 items-center justify-center rounded-l-lg bg-zinc-800/50"
			on:click={() => (hidden = !hidden)}
		>
			{#if hidden}
				<EyeOff class="size-5 text-zinc-700" />
			{:else}
				<Eye class="size-5 text-zinc-700" />
			{/if}
		</button>
		<button on:click={copy} class="peer w-full">
			<input
				type={hidden ? 'password' : 'text'}
				disabled
				value="{origin}/{linkCode}"
				class="pointer-events-none w-full bg-transparent text-center font-rounded text-xs"
			/>
		</button>
	</div>
</div>
