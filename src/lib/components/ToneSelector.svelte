<script lang="ts">
	let {
		tones,
		selectedId = '',
		onSelect
	}: {
		tones: Array<{ id: string; label: string; emoji: string }>;
		selectedId?: string;
		onSelect: (id: string) => void;
	} = $props();
</script>

<div class="mb-4">
	<p class="text-sm font-black mb-3 ml-1 bg-lavender-light/30 inline-block px-2 py-0.5 rounded-md border border-text-primary/50 rotate-1">选个语气 🎭</p>
	<div class="flex gap-3">
		{#each tones as tone}
			{@const isActive = tone.id === selectedId}
			<button
				class="flex-1 flex flex-col items-center gap-1.5
				       py-3.5 rounded-[var(--radius-base)]
				       font-bold text-sm
				       brutal-border
				       {isActive
				         ? 'bg-lavender text-text-primary brutal-shadow-pressed'
				         : 'bg-white text-text-primary brutal-shadow brutal-shadow-hover brutal-shadow-active'}"
				onclick={() => onSelect(tone.id)}
			>
				<span class="text-2xl mb-1 transform group-hover:scale-110 transition-transform">{tone.emoji}</span>
				<span class="text-xs tracking-wide">{tone.label}</span>
			</button>
		{/each}
	</div>
</div>
