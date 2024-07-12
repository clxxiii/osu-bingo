<script lang="ts">
	export let href: string;
</script>

<a
	{href}
	class="p-2 rounded relative transition hover:bg-[rgba(0,0,0,0.5)] hover:after:w-[100%] after:transition-all uppercase after:absolute after:bottom-0 hover:after:left-[0%] after:left-[50%] after:w-[0%] after:bg-purple-300 after:h-[2px] block"
>
	<slot />
</a>
