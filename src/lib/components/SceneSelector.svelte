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

<div class="mb-4">
	<p class="text-sm text-text-secondary mb-2 font-medium">{label}</p>
	<div class="flex flex-wrap gap-2">
		{#each items as item}
			{@const isActive = item.id === selectedId}
			{@const IconComp = item.icon ? iconMap[item.icon] : null}
			<button
				class="inline-flex items-center gap-1.5 px-4 py-2
				       rounded-full text-sm font-medium
				       transition-all duration-200
				       {isActive
				         ? 'bg-coral text-white shadow-md shadow-coral/25'
				         : 'bg-white text-text-secondary hover:bg-coral-light/20 hover:text-coral'}"
				onclick={() => onSelect(item.id)}
			>
				{#if IconComp}
					<IconComp size={16} />
				{/if}
				{item.label}
			</button>
		{/each}
	</div>
</div>
