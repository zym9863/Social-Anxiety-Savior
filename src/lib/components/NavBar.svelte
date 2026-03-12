<script lang="ts">
	import { page } from '$app/stores';
	import { MessageCircle, Lightbulb } from 'lucide-svelte';

	const tabs = [
		{ href: '/', label: '找话题', icon: Lightbulb },
		{ href: '/reply', label: '回消息', icon: MessageCircle }
	] as const;
</script>

<nav class="fixed bottom-0 left-0 right-0 z-40
            bg-white/90 backdrop-blur-sm border-t border-coral/10
            safe-area-bottom">
	<div class="flex justify-around items-center h-16 max-w-lg mx-auto">
		{#each tabs as tab}
			{@const isActive = $page.url.pathname === tab.href}
			{@const Icon = tab.icon}
			<a
				href={tab.href}
				class="flex flex-col items-center gap-1 py-2 px-6 rounded-xl
				       transition-colors duration-200
				       {isActive ? 'text-coral' : 'text-text-secondary hover:text-coral-light'}"
				aria-current={isActive ? 'page' : undefined}
			>
				<Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
				<span class="text-xs font-medium">{tab.label}</span>
			</a>
		{/each}
	</div>
</nav>
