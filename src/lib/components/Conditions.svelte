<script>
	import { game } from '$lib/stores';
	import { getMeaning } from '$lib/bingo-helpers/claimworthy';
</script>

<div class="text-md flex justify-between pt-2 font-rounded">
	<div class="rounded bg-base-700 p-2">
		<span class="">Claim Condition: </span>
		<span class="font-black text-amber-300">{getMeaning($game?.claim_condition ?? '')}</span>
	</div>
	<div class="rounded bg-base-700 p-2">
		<span class="">Reclaim Condition: </span>
		<span class="font-black capitalize text-amber-300">{$game?.tiebreaker}</span>
	</div>
</div>
