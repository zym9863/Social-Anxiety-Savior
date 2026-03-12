<script lang="ts">
	import {
		Utensils, Briefcase, Heart, PartyPopper, UserPlus, Home
	} from 'lucide-svelte';

	let {
		items,
		selectedId = '',
		onSelect,
		label = '选择'
	}: {
		items: Array<{ id: string; label: string; icon?: string }>;
		selectedId?: string;
		onSelect: (id: string) => void;
		label?: string;
	} = $props();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const iconMap: Record<string, any> = {
		utensils: Utensils,
		briefcase: Briefcase,
		heart: Heart,
		'party-popper': PartyPopper,
		'user-plus': UserPlus,
		home: Home
	};
</script>

<div class="mb-6">
	<p class="text-sm font-black mb-3 ml-1 bg-coral-light/30 inline-block px-2 py-0.5 rounded-md -rotate-1 border border-text-primary/50">{label}</p>
	<div class="flex flex-wrap gap-3">
		{#each items as item}
			{@const isActive = item.id === selectedId}
			{@const IconComp = item.icon ? iconMap[item.icon] : null}
			<button
				class="inline-flex items-center gap-1.5 px-4 py-2.5
				       rounded-[var(--radius-base)] text-sm font-bold
				       brutal-border
				       {isActive
				         ? 'bg-coral text-white brutal-shadow-pressed'
				         : 'bg-white text-text-primary brutal-shadow brutal-shadow-hover brutal-shadow-active'}"
				onclick={() => onSelect(item.id)}
			>
				{#if IconComp}
					<IconComp size={18} strokeWidth={2.5} />
				{/if}
				{item.label}
			</button>
		{/each}
	</div>
</div>
