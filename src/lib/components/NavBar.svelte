<script lang="ts">
	import { page } from '$app/stores';
	import { MessageCircle, Lightbulb } from 'lucide-svelte';

	const tabs = [
		{ href: '/', label: '找话题', icon: Lightbulb },
		{ href: '/reply', label: '回消息', icon: MessageCircle }
	] as const;
</script>

<nav class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[400px]">
	<div class="flex justify-around items-center h-16 brutal-border brutal-shadow bg-white rounded-full px-2">
		{#each tabs as tab}
			{@const isActive = $page.url.pathname === tab.href}
			{@const Icon = tab.icon}
			<a
				href={tab.href}
				class="flex items-center justify-center gap-2 py-2 px-5 rounded-full
				       transition-all duration-300 font-black
				       {isActive ? 'bg-coral text-white brutal-border brutal-shadow shadow-[2px_2px_0px_#1A1A1A] -translate-y-1 rotate-2' : 'text-text-secondary hover:text-text-primary hover:bg-warm-bg'}"
				aria-current={isActive ? 'page' : undefined}
			>
				<Icon size={20} strokeWidth={isActive ? 3 : 2} class={isActive ? 'animate-bounce' : ''} />
				<span class="text-sm">{tab.label}</span>
			</a>
		{/each}
	</div>
</nav>
