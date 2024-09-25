<script lang="ts">
	export let id: number;
	const DEV_ID = 10962678;
</script>

{#if id == DEV_ID}
	<span
		class="rounded-full bg-yellow-500 p-1 px-2 font-rounded text-xs font-black not-italic text-zinc-700"
		>DEV</span
	>
{/if}
