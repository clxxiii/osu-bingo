<script lang="ts">
	export let user: Bingo.User | undefined;
</script>

{#if user != undefined}
	<button
		class="text-display grid gap-x-1 items-center px-1 h-10 hover:bg-zinc-900 rounded transition"
	>
		<img
			class="row-start-1 row-end-3 col-start-1 col-end-2 h-8 rounded-full"
			src={user.avatar_url}
			alt=""
		/>
		<div class="text-left col-start-2 col-end-3 row-start-1 row-end 2">{user.username}</div>
		<div class="text-[8px] text-left col-start-2 col-end-3 row-start-2 row-end-3">
			#{user.global_rank?.toLocaleString()}
		</div>
	</button>
{:else}
	<a
		class="font-rounded px-10 hover:bg-pink-900 transition active:bg-pink-950 font-bold bg-pink-800 border-pink-200 rounded-full p-1 w-40"
		href="/auth/login/osu">login with osu!</a
	>
{/if}

<style>
	button.grid {
		grid-template-columns: 2rem calc(100% - 2rem);
	}
</style>
