<script>
	import { getClaimConditionMeaning } from '$lib/gamerules/meaning';
	import { game_rules } from '$lib/stores';
</script>

<div class="text-md flex justify-between pt-2 font-rounded">
	<div class="rounded bg-base-700 p-2">
		<span class="">Claim Condition: </span>
		<span class="font-black text-amber-300">
			{#if $game_rules}
				{$game_rules && getClaimConditionMeaning($game_rules.claim_condition)}
			{/if}
		</span>
	</div>
	<div class="rounded bg-base-700 p-2">
		<span class="">Reclaim Condition: </span>
		<span class="font-black capitalize text-amber-300">{$game_rules?.reclaim_condition}</span>
	</div>
</div>
