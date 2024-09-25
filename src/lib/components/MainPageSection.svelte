<script lang="ts">
	export let title: string;
</script>

<div>
	<h2 class="font-rounded text-2xl font-bold">{title}</h2>
	<p class="ml-2"><slot /></p>
</div>
