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

<div class="relative group">
	<textarea
		class="w-full min-h-[140px] p-5 pr-12
		       bg-white rounded-[var(--radius-card)]
		       brutal-border brutal-shadow
		       text-text-primary text-base font-medium leading-relaxed
		       placeholder:text-text-light/70
		       focus:outline-none focus:ring-0 focus:shadow-[6px_6px_0px_#1A1A1A] focus:-translate-y-1
		       resize-none transition-all duration-200"
		placeholder="把那些让你头皮发麻的消息粘贴在这里..."
		{value}
		oninput={(e) => onInput(e.currentTarget.value)}
	></textarea>

	{#if value}
		<button
			class="absolute top-4 right-4
			       p-1.5 rounded-full brutal-border bg-coral text-white
			       hover:bg-coral-dark hover:rotate-90 hover:scale-110
			       active:scale-95
			       transition-all duration-200"
			onclick={onClear}
			aria-label="清空输入"
		>
			<X size={20} strokeWidth={3} />
		</button>
	{/if}
</div>
