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
data-[team=BLUE]:bg-blue-900 h-full w-[250px] transition data-[team=RED]:bg-amber-900 bg-zinc-900/50 p-2 rounded-lg flex gap-x-2"
>
	{#if buttons}
		<div
			data-team={currentTeam}
			class="transition flex data-[team=BLUE]:text-blue-700 data-[team=RED]:text-amber-700 flex-col leading-4 items-center justify-center text-zinc-700"
		>
			<span>T</span>
			<span>E</span>
			<span>A</span>
			<span>M</span>
		</div>
	{/if}
	<div class="flex flex-col justify-center gap-y-2 w-full">
		{#if !buttons}
			<div
				data-team={currentTeam}
				class="transition text-center data-[team=BLUE]:text-blue-700 data-[team=RED]:text-amber-700 text-zinc-700"
			>
				YOUR TEAM
			</div>
		{/if}
		<span
			data-team={currentTeam}
			class="bg-zinc-600 h-8 transition rounded-full flex justify-center items-center data-[team=BLUE]:bg-blue-700 data-[team=RED]:bg-amber-700"
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
					class="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 h-8 p-1 rounded-lg text-sm px-2 transition"
				>
					LEAVE
				</button>
			{:else}
				<button
					on:click={join}
					class="bg-green-600 hover:bg-green-700 active:bg-green-800 h-8 p-1 rounded-lg text-sm px-2 transition"
					>JOIN</button
				>
			{/if}
		{/if}
	</div>
</div>
