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
	class="bg-white rounded-[var(--radius-card)] p-5 relative
	       brutal-border brutal-shadow hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1A1A1A] transition-all duration-300"
	in:fly={{ y: 20, duration: 400, delay: index * 100 }}
>
	<div class="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-lavender brutal-border flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#1A1A1A]">
		{index + 1}
	</div>

	<p class="text-base font-bold leading-relaxed text-text-primary mb-4 mt-1">
		{text}
	</p>

	<div class="flex items-end justify-between gap-4 mt-2">
		{#if tip}
			<div class="bg-warm-bg px-3 py-2 rounded-lg brutal-border border-2 text-xs font-bold text-text-secondary w-full transform rotate-1">
				💡 {tip}
			</div>
		{:else}
			<div class="w-full"></div>
		{/if}

		<button
			class="flex-shrink-0 inline-flex items-center gap-1.5
			       text-sm font-black px-4 py-2 rounded-xl
			       brutal-border
			       {copied
			         ? 'bg-mint text-text-primary shadow-[0px_0px_0px_#1A1A1A] translate-y-[2px] translate-x-[2px]'
			         : 'bg-white text-text-primary shadow-[2px_2px_0px_#1A1A1A] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]'}"
			onclick={copyToClipboard}
		>
			{#if copied}
				<Check size={16} strokeWidth={3} />
				搞定
			{:else}
				<Copy size={16} strokeWidth={2.5} />
				复制
			{/if}
		</button>
	</div>
</div>
