<script lang="ts">
	import { fade } from 'svelte/transition';
	import LargeGrid from './grids/LargeGrid.svelte';
	// import MediumGrid from './grids/MediumGrid.svelte';
	// import MobileGrid from './grids/MobileGrid.svelte';

	export let state: number;
	export let host: boolean = false;
</script>

<div transition:fade class="ml-4 mt-4 grid">
	<LargeGrid {state} {host}>
		<slot name="player-list" slot="player-list"></slot>
		<slot name="square-sidebar" slot="square-sidebar"></slot>
		<slot name="board" slot="board"></slot>
		<slot name="event-list" slot="event-list"></slot>
		<slot name="chat" slot="chat"></slot>
		<slot name="host-settings" slot="host-settings"></slot>
	</LargeGrid>
</div>

<!--  -->
<!-- Half Screen Grid -->
<!-- <div class="hidden md:grid xl:hidden"> -->
<!-- <MediumGrid {state} {host}> -->
<!-- <slot name="player-list" slot="player-list"></slot> -->
<!-- <slot name="square-sidebar" slot="square-sidebar"></slot> -->
<!-- <slot name="board" slot="board"></slot> -->
<!-- <slot name="event-list" slot="event-list"></slot> -->
<!-- <slot name="chat" slot="chat"></slot> -->
<!-- <slot name="host-settings" slot="host-settings"></slot> -->
<!-- </MediumGrid> -->
<!-- </div> -->
<!--  -->
<!-- Mobile Grid -->
<!-- <div class="grid md:hidden"> -->
<!-- <MobileGrid {state} {host}> -->
<!-- <slot name="player-list" slot="player-list"></slot> -->
<!-- <slot name="square-sidebar" slot="square-sidebar"></slot> -->
<!-- <slot name="board" slot="board"></slot> -->
<!-- <slot name="event-list" slot="event-list"></slot> -->
<!-- <slot name="chat" slot="chat"></slot> -->
<!-- <slot name="host-settings" slot="host-settings"></slot> -->
<!-- </MobileGrid> -->
<!-- </div> -->
<!--  -->
