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
	<p class="text-sm text-text-secondary mb-2 font-medium">选个语气</p>
	<div class="flex gap-2">
		{#each tones as tone}
			{@const isActive = tone.id === selectedId}
			<button
				class="flex-1 flex flex-col items-center gap-1
				       py-3 rounded-[var(--radius-base)]
				       text-sm font-medium
				       transition-all duration-200
				       {isActive
				         ? 'bg-coral text-white shadow-md shadow-coral/25'
				         : 'bg-white text-text-secondary hover:bg-coral-light/20'}"
				onclick={() => onSelect(tone.id)}
			>
				<span class="text-lg">{tone.emoji}</span>
				<span class="text-xs">{tone.label}</span>
			</button>
		{/each}
	</div>
</div>
