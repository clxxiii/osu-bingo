<script lang="ts">
	// Takes an announcement and replaces [X] with a
	// countdown to the specified date.
	let interval: Timer;
	let text: string;
	export const startTimer = (template: string, time: Date) => {
		if (typeof time == 'string') {
			time = new Date(time);
		}

		const updateText = () => {
			const difference = new Date(time.valueOf() - new Date().valueOf());
			const mins = difference.getMinutes();
			const secs = difference.getSeconds();

			text = template.replaceAll('[X]', `${mins}:${secs < 10 ? '0' + secs : secs}`);
		};

		updateText();
		interval = setInterval(updateText, 1000);
	};
</script>
