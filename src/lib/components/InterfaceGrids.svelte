<script lang="ts">
	import LargeGrid from './grids/LargeGrid.svelte';
	import MediumGrid from './grids/MediumGrid.svelte';
	import MobileGrid from './grids/MobileGrid.svelte';

	export let state: number = 1;
</script>

<div class="hidden xl:grid">
	<LargeGrid {state}>
		<slot name="player-list" slot="player-list"></slot>
		<slot name="square-sidebar" slot="square-sidebar"></slot>
		<slot name="board" slot="board"></slot>
		<slot name="event-list" slot="event-list"></slot>
		<slot name="chat" slot="chat"></slot>
	</LargeGrid>
</div>

<!-- Half Screen Grid -->
<div class="hidden md:grid xl:hidden">
	<MediumGrid {state}>
		<slot name="player-list" slot="player-list"></slot>
		<slot name="square-sidebar" slot="square-sidebar"></slot>
		<slot name="board" slot="board"></slot>
		<slot name="event-list" slot="event-list"></slot>
		<slot name="chat" slot="chat"></slot>
	</MediumGrid>
</div>

<!-- Mobile Grid -->
<div class="grid md:hidden">
	<MobileGrid {state}>
		<slot name="player-list" slot="player-list"></slot>
		<slot name="square-sidebar" slot="square-sidebar"></slot>
		<slot name="board" slot="board"></slot>
		<slot name="event-list" slot="event-list"></slot>
		<slot name="chat" slot="chat"></slot>
	</MobileGrid>
</div>
