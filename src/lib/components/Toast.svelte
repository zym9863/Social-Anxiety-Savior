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
		class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50
		       bg-text-primary text-warm-bg px-5 py-2.5
		       rounded-[var(--radius-base)] text-sm font-medium shadow-lg"
		in:fly={{ y: 20, duration: 200 }}
		out:fade={{ duration: 150 }}
		role="status"
		aria-live="polite"
	>
		{message}
	</div>
{/if}
