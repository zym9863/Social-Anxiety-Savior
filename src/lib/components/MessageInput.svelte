<script lang="ts">
	import { X } from 'lucide-svelte';

	let {
		value = '',
		onInput,
		onClear
	}: {
		value?: string;
		onInput: (text: string) => void;
		onClear: () => void;
	} = $props();
</script>

<div class="relative">
	<textarea
		class="w-full min-h-[120px] p-4 pr-10
		       bg-white rounded-[var(--radius-card)]
		       border border-coral/10
		       text-text-primary text-sm leading-relaxed
		       placeholder:text-text-light
		       focus:outline-none focus:ring-2 focus:ring-coral/30
		       resize-none transition-shadow duration-200"
		placeholder="把收到的消息粘贴在这里..."
		{value}
		oninput={(e) => onInput(e.currentTarget.value)}
	></textarea>

	{#if value}
		<button
			class="absolute top-3 right-3
			       p-1 rounded-full
			       text-text-light hover:text-coral hover:bg-coral/10
			       transition-colors duration-200"
			onclick={onClear}
			aria-label="清空输入"
		>
			<X size={18} />
		</button>
	{/if}
</div>
