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
			class="bg-white rounded-[var(--radius-card)] p-5 shadow-sm
			       border border-coral/10"
			in:fly={{ y: 10, duration: 250 }}
		>
			<p class="text-lg leading-relaxed text-text-primary mb-3">
				"{text}"
			</p>

			{#if tip}
				<p class="text-xs text-text-light mb-3">{tip}</p>
			{/if}

			{#if tags.length > 0}
				<div class="flex flex-wrap gap-1.5 mb-4">
					{#each tags as tag}
						<span class="text-xs px-2 py-0.5 rounded-full bg-warm-bg text-text-secondary">
							{tag}
						</span>
					{/each}
				</div>
			{/if}

			<div class="flex gap-2">
				<button
					class="flex-1 flex items-center justify-center gap-1.5
					       py-2.5 rounded-[var(--radius-base)]
					       bg-coral text-white text-sm font-medium
					       hover:bg-coral-dark transition-colors duration-200
					       active:scale-[0.98]"
					onclick={handleRefresh}
				>
					<RefreshCw size={15} />
					换一个
				</button>
				<button
					class="flex items-center justify-center gap-1.5
					       py-2.5 px-4 rounded-[var(--radius-base)]
					       bg-warm-bg text-text-secondary text-sm font-medium
					       hover:bg-coral-light/20 transition-colors duration-200
					       active:scale-[0.98]"
					onclick={copyToClipboard}
				>
					<Copy size={15} />
					复制
				</button>
			</div>
		</div>
	{/key}
{/if}

<Toast message="已复制到剪贴板 ✓" bind:visible={toastVisible} />
