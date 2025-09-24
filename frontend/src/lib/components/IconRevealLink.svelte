<script lang="ts">
	export let text: string = 'text';
	export let href: string;
	export let size = 20;

	let textLength: number;
</script>

<a
	{href}
	style="--s: {size}px; --t: {textLength}px;"
	class="group relative overflow-hidden rounded-lg p-[calc(var(--s)/4)] transition hover:bg-zinc-900"
>
	<div
		class="relative flex h-[--s] w-[--s] items-center overflow-hidden transition-all group-hover:w-[calc(var(--s)+var(--t))]"
	>
		<div class="flex h-[--s] w-[--s] justify-center transition">
			<slot />
		</div>
		<div bind:clientWidth={textLength} class="w-fit pl-1 font-thin uppercase transition">
			{text}
		</div>
	</div>
</a>
