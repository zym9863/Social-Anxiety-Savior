<script lang="ts">
	import { fly } from 'svelte/transition';
	import { RefreshCw, Copy } from 'lucide-svelte';
	import Toast from './Toast.svelte';

	let {
		text = '',
		tip = '',
		tags = [] as string[],
		onRefresh
	}: {
		text?: string;
		tip?: string;
		tags?: string[];
		onRefresh?: () => void;
	} = $props();

	let toastVisible = $state(false);
	let animKey = $state(0);

	async function copyToClipboard() {
		await navigator.clipboard.writeText(text);
		toastVisible = true;
	}

	function handleRefresh() {
		animKey++;
		onRefresh?.();
	}
</script>

{#if text}
	{#key animKey}
		<div
			class="bg-white rounded-[var(--radius-card)] p-6 brutal-border brutal-shadow relative"
			in:fly={{ y: 20, duration: 400, opacity: 0 }}
		>
			<!-- Decorative pin -->
			<div class="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-coral rounded-full brutal-border shadow-sm z-10 flex items-center justify-center">
				<div class="w-3 h-3 bg-white/40 rounded-full"></div>
			</div>

			<p class="text-xl font-black leading-relaxed text-text-primary mb-4 mt-2">
				"{text}"
			</p>

			{#if tip}
				<div class="bg-warm-bg p-3 rounded-[var(--radius-base)] brutal-border border-2 mb-4 transform -rotate-1">
					<p class="text-sm font-bold flex gap-2 items-start">
						<span class="text-coral">💡</span>
						<span>{tip}</span>
					</p>
				</div>
			{/if}

			{#if tags.length > 0}
				<div class="flex flex-wrap gap-2 mb-5">
					{#each tags as tag}
						<span class="text-xs font-bold px-2.5 py-1 rounded-md bg-mint/40 brutal-border border-2 text-text-primary transform rotate-1">
							#{tag}
						</span>
					{/each}
				</div>
			{/if}

			<div class="flex gap-3">
				<button
					class="flex-1 flex items-center justify-center gap-2
					       py-3 rounded-[var(--radius-base)]
					       bg-coral text-white font-black
					       brutal-border brutal-shadow brutal-shadow-hover brutal-shadow-active"
					onclick={handleRefresh}
				>
					<RefreshCw size={18} strokeWidth={2.5} />
					换一个
				</button>
				<button
					class="flex items-center justify-center gap-2
					       py-3 px-5 rounded-[var(--radius-base)]
					       bg-white text-text-primary font-black
					       brutal-border brutal-shadow brutal-shadow-hover brutal-shadow-active"
					onclick={copyToClipboard}
				>
					<Copy size={18} strokeWidth={2.5} />
					复制
				</button>
			</div>
		</div>
	{/key}
{/if}

<Toast message="已复制到剪贴板 ✓" bind:visible={toastVisible} />
