<script lang="ts">
	import { Confetti } from 'svelte-confetti';

	export let team: string;

	const confettiColors: { [key: string]: string[] } = {
		BLUE: ['#a3b7fe', '#4443e8'],
		RED: ['#b13e24', '#dc2626', '#fca5a5'],
		default: ['#fff', '#aaa', '#777']
	};

	let colors: string[];
	$: colors = confettiColors[team.toUpperCase()] ?? confettiColors['default'];
</script>

<div
	class="pointer-events-none fixed top-[-50px] left-0 w-screen h-screen flex justify-center overflow-hidden"
>
	<!-- Fullscreen -->
	<Confetti
		colorArray={colors}
		x={[-5, 5]}
		y={[0, 0.1]}
		fallDistance="50vh"
		infinite
		delay={[100, 2500]}
		duration={5000}
		amount={100}
	/>

	<!-- Cannons -->
	<div class="absolute left-0 bottom-0">
		<Confetti colorArray={colors} delay={[0, 250]} x={[0.25, 3]} y={[0.75, 4]} />
	</div>
	<div class="absolute right-0 bottom-0">
		<Confetti colorArray={colors} delay={[0, 250]} x={[-0.25, -3]} y={[0.75, 4]} />
	</div>
</div>
