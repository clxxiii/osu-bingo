<script lang="ts">
	export let href: string;
</script>

<a
	{href}
	class="relative block rounded p-2 uppercase transition after:absolute after:bottom-0 after:left-[50%] after:h-[2px] after:w-[0%] after:bg-purple-300 after:transition-all hover:bg-[rgba(0,0,0,0.5)] hover:after:left-[0%] hover:after:w-[100%]"
>
	<slot />
</a>
