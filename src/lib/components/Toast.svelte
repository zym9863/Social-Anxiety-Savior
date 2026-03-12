<script lang="ts">
	import { fly, fade } from 'svelte/transition';

	let {
		message = '',
		visible = $bindable(false),
		duration = 2000
	}: {
		message?: string;
		visible?: boolean;
		duration?: number;
	} = $props();

	let timeoutId: ReturnType<typeof setTimeout>;

	$effect(() => {
		if (visible) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				visible = false;
			}, duration);
		}
	});
</script>

{#if visible}
	<div
		class="fixed top-8 left-1/2 -translate-x-1/2 z-50
		       bg-mint text-text-primary px-6 py-3
		       rounded-full text-sm font-black brutal-border brutal-shadow"
		in:fly={{ y: -20, duration: 300 }}
		out:fade={{ duration: 150 }}
		role="status"
		aria-live="polite"
	>
		{message}
	</div>
{/if}
