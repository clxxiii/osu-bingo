<script lang="ts">
	import { browser } from '$app/environment';

	export let currentTeam: string | undefined;
	export let user: Bingo.User | undefined;
	export let buttons = false;

	const leave = async () => {
		await fetch(`?/leave_game`, {
			method: 'POST',
			body: new FormData()
		});
	};

	const join = async () => {
		if (!user) {
			if (browser) {
				const params = new URLSearchParams();
				params.set('from', window.location.href + `?join`);
				window.location.href = `/auth/login/osu?${params.toString()}`;
			}
		}
		const data = new FormData();
		data.set('team', 'RED');
		await fetch(`?/join_game`, {
			body: data,
			method: 'POST'
		});
	};
</script>

<div
	data-team={currentTeam}
	class="
flex h-full w-[250px] gap-x-2 rounded-lg bg-zinc-900/50 p-2 transition data-[team=BLUE]:bg-blue-900 data-[team=RED]:bg-amber-900"
>
	{#if buttons}
		<div
			data-team={currentTeam}
			class="flex flex-col items-center justify-center leading-4 text-zinc-700 transition data-[team=BLUE]:text-blue-700 data-[team=RED]:text-amber-700"
		>
			<span>T</span>
			<span>E</span>
			<span>A</span>
			<span>M</span>
		</div>
	{/if}
	<div class="flex w-full flex-col justify-center gap-y-2">
		{#if !buttons}
			<div
				data-team={currentTeam}
				class="text-center text-zinc-700 transition data-[team=BLUE]:text-blue-700 data-[team=RED]:text-amber-700"
			>
				YOUR TEAM
			</div>
		{/if}
		<span
			data-team={currentTeam}
			class="flex h-8 items-center justify-center rounded-full bg-zinc-600 transition data-[team=BLUE]:bg-blue-700 data-[team=RED]:bg-amber-700"
		>
			{#if currentTeam}
				{currentTeam.toUpperCase()} TEAM
			{:else}
				SPECTATING
			{/if}
		</span>
		{#if buttons}
			{#if currentTeam}
				<button
					on:click={leave}
					class="h-8 rounded-lg bg-amber-600 p-1 px-2 text-sm transition hover:bg-amber-700 active:bg-amber-800"
				>
					LEAVE
				</button>
			{:else}
				<button
					on:click={join}
					class="h-8 rounded-lg bg-green-600 p-1 px-2 text-sm transition hover:bg-green-700 active:bg-green-800"
					>JOIN</button
				>
			{/if}
		{/if}
	</div>
</div>
