<script lang="ts">
	export let title: string;
</script>

<div>
	<h2 class="font-display text-2xl">{title}</h2>
	<p class="ml-2"><slot /></p>
</div>
