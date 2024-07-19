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

<div class="bg-zinc-900/50 rounded-lg p-2 h-full w-[250px]">
	<div class="w-full">Click to Copy</div>
	<div class="bg-zinc-900 rounded-lg h-8 flex border-zinc-700 border-[1px]">
		<button
			class="bg-zinc-800/50 rounded-l-lg size-8 flex items-center justify-center"
			on:click={() => (hidden = !hidden)}
		>
			{#if hidden}
				<EyeOff class="text-zinc-700 size-5" />
			{:else}
				<Eye class="text-zinc-700 size-5" />
			{/if}
		</button>
		<button on:click={copy} class="peer w-full">
			<input
				type={hidden ? 'password' : 'text'}
				disabled
				value="{origin}/{linkCode}"
				class="pointer-events-none font-rounded w-full text-center text-xs bg-transparent"
			/>
		</button>
	</div>
</div>
