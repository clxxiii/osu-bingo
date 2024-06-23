<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Welcome to osu! Bingo!</h1>
{#each data.games as game}
	<div>
		{JSON.stringify(game)}
	</div>
{/each}
