<script>
	import { Plus } from 'lucide-svelte';
</script>

<svelte:head>
	<title>My Templates</title>
</svelte:head>

<div class="m-auto mt-10 w-full max-w-[700px]">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl">Templates</h1>
			Customize the rules of the game to make your own version!
		</div>
		<a
			href="/templates/new"
			class="m-2 flex rounded bg-green-500 px-2 py-1 font-rounded font-bold text-zinc-200 transition hover:bg-green-600 active:bg-green-700"
		>
			<Plus />
			New
		</a>
	</div>
	<hr class="my-2 border-zinc-700" />
</div>
