<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Copy, Check } from 'lucide-svelte';

	let {
		text = '',
		tip = '',
		index = 0
	}: {
		text?: string;
		tip?: string;
		index?: number;
	} = $props();

	let copied = $state(false);

	async function copyToClipboard() {
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => { copied = false; }, 1500);
	}
</script>

<div
	class="bg-white rounded-[var(--radius-card)] p-4
	       border border-coral/10 shadow-sm"
	in:fly={{ y: 10, duration: 200, delay: index * 80 }}
>
	<p class="text-sm leading-relaxed text-text-primary mb-2">
		{text}
	</p>

	<div class="flex items-center justify-between">
		{#if tip}
			<span class="text-xs text-text-light">{tip}</span>
		{:else}
			<span></span>
		{/if}

		<button
			class="inline-flex items-center gap-1
			       text-xs px-3 py-1.5 rounded-full
			       transition-all duration-200
			       {copied
			         ? 'bg-mint/30 text-green-700'
			         : 'bg-warm-bg text-text-secondary hover:bg-coral-light/20 hover:text-coral'}"
			onclick={copyToClipboard}
		>
			{#if copied}
				<Check size={13} />
				已复制
			{:else}
				<Copy size={13} />
				复制
			{/if}
		</button>
	</div>
</div>
