<script lang="ts">
	export let id: number;
	const DEV_ID = 10962678;
</script>

{#if id == DEV_ID}
	<span
		class="text-xs not-italic font-rounded text-zinc-700 bg-yellow-500 p-1 px-2 font-black rounded-full"
		>DEV</span
	>
{/if}
