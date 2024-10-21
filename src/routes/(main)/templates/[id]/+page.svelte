<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	{JSON.stringify(data.template, null, 4)}
</div>
