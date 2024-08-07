<script lang="ts">
	export let grade: string;
</script>

<span class="font-rounded font-black text-3xl">
	{#if grade == 'XH'}
		<span class="bg-blue-100 p-1 pb-0 rounded text-zinc-700">SS</span>
	{:else if grade == 'X'}
		<span class="bg-yellow-200 p-1 pb-0 rounded text-zinc-700">SS</span>
	{:else if grade == 'SH'}
		<span class="text-blue-200">S</span>
	{:else if grade == 'S'}
		<span class="text-yellow-200">S</span>
	{:else if grade == 'A'}
		<span class="text-green-300">A</span>
	{:else if grade == 'B'}
		<span class="text-blue-300">B</span>
	{:else if grade == 'C'}
		<span class="text-purple-700">C</span>
	{:else if grade == 'D'}
		<span class="text-red-300">D</span>
	{:else if grade == 'F'}
		<span class="text-red-600">F</span>
	{/if}
</span>
