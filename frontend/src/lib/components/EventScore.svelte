<script lang="ts">
	import { square as squareStore } from '$lib/stores';
	import { formatDistance } from 'date-fns';
	import { ListVideo } from 'lucide-svelte';

	export let score: Bingo.Card.FullScore;
	export let square: Bingo.Card.FullSquare;
	export let stat: string;
	export let square_index: number;

	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	const click = (ev: MouseEvent) => {
		ev.preventDefault();
		$squareStore = square_index;
	};
</script>

{#if score.grade != 'F'}
	<a
		href="https://osu.ppy.sh/scores/{score.score_id}"
		data-claimer={score.claimworthy ? score.user.team_name : ''}
		class="flex size-full rounded bg-zinc-900/50 p-2 data-[claimer=BLUE]:bg-blue-600 data-[claimer=RED]:bg-amber-600"
		target="_blank"
		rel="noopener noreferrer"
	>
		<div class="mr-1 flex items-center opacity-50">
			<ListVideo />
		</div>
		<!-- Square Button -->
		<button
			class="group relative size-10 overflow-hidden rounded-lg hover:shadow-lg"
			on:click={click}
		>
			<img
				class="absolute top-0 size-full blur-sm brightness-75 transition group-hover:brightness-50"
				src={square.data.square_url}
				alt=""
			/>
			<div
				class="absolute top-0 flex size-full items-center justify-center font-rounded text-lg font-black text-white/50 transition group-hover:text-white"
			>
				<span>{alphabet.charAt(square.x_pos)}</span>
				<span>{square.y_pos + 1}</span>
			</div>
		</button>

		<!-- User -->
		<div class="pl-2">
			<div class="flex items-center">
				<span>
					<img src={score.user.user.avatar_url} class="inline h-5 rounded-full" alt="" />
					<span
						data-user={score.user.team_name.toUpperCase()}
						class="text-sm font-bold data-[user=BLUE]:text-blue-300 data-[user=RED]:text-amber-300"
						>{score.user.user.username}
					</span>
				</span>
			</div>
			<div class="text-xs">{formatDistance(score.date, new Date(), { addSuffix: true })}</div>
		</div>

		<div
			class="absolute right-0 top-0 flex h-full translate-y-1 items-center p-2 font-rounded text-2xl"
		>
			{#if stat == 'score'}
				{score.score.toLocaleString()}
			{:else if stat == 'accuracy'}
				{(score.accuracy * 100).toFixed(2)}%
			{:else if stat == 'combo'}
				{score.max_combo.toLocaleString()}x
			{:else if stat == 'pp'}
				{Math.round(score.pp ?? 0).toLocaleString()}pp
			{/if}
		</div>
	</a>
{:else}
	<div class="relative pl-2 opacity-80">
		<span class="mr-1 opacity-50">
			<ListVideo class="inline" />
		</span>
		Score by
		<span
			data-user={score.user.team_name.toUpperCase()}
			class="font-bold data-[user=BLUE]:text-blue-400 data-[user=RED]:text-amber-400"
		>
			{score.user.user.username}
		</span>
		<span>
			<button
				class="absolute right-0 w-8 rounded bg-zinc-700 px-1 font-rounded font-bold"
				on:click={click}
			>
				{alphabet.charAt(square.x_pos)}{square.y_pos + 1}
			</button>
		</span>
	</div>
{/if}
