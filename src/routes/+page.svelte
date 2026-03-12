<script lang="ts">
	import SceneSelector from '$lib/components/SceneSelector.svelte';
	import TopicCard from '$lib/components/TopicCard.svelte';
	import {
		scenes,
		selectedSceneId,
		selectedRelationshipId,
		selectedScene,
		relationships,
		currentTopics,
		selectScene,
		selectRelationship
	} from '$lib/stores/topicStore';
	import { Sparkles } from 'lucide-svelte';

	let currentIndex = $state(0);

	let topic = $derived($currentTopics[currentIndex] ?? null);

	function refreshTopic() {
		if ($currentTopics.length <= 1) return;
		let newIndex: number;
		do {
			newIndex = Math.floor(Math.random() * $currentTopics.length);
		} while (newIndex === currentIndex && $currentTopics.length > 1);
		currentIndex = newIndex;
	}

	function handleSceneSelect(id: string) {
		selectScene(id);
		currentIndex = 0;
	}

	function handleRelationshipSelect(id: string) {
		selectRelationship(id);
		currentIndex = 0;
	}
</script>

<div>
	<header class="mb-10 brutal-border brutal-shadow bg-coral text-white p-6 rounded-[var(--radius-card)]">
		<div class="flex items-center gap-3 mb-2">
			<div class="bg-white p-2 rounded-full brutal-border brutal-shadow text-coral transform -rotate-12">
				<Sparkles size={28} strokeWidth={2.5} />
			</div>
			<h1 class="text-3xl font-black tracking-tight" style="text-shadow: 2px 2px 0px #1A1A1A;">找话题</h1>
		</div>
		<p class="text-white/90 font-medium text-sm border-t-2 border-white/30 pt-2 mt-2">
			谁说聊天一定要尴尬？选个组合直接开聊。
		</p>
	</header>

	<div class="space-y-6">
		<SceneSelector
			items={scenes.map(s => ({ id: s.id, label: s.label, icon: s.icon }))}
			selectedId={$selectedSceneId}
			onSelect={handleSceneSelect}
			label="在哪儿聊？📍"
		/>

		{#if $relationships.length > 0}
			<div class="animate-in fade-in slide-in-from-bottom-2">
				<SceneSelector
					items={$relationships.map(r => ({ id: r.id, label: r.label }))}
					selectedId={$selectedRelationshipId}
					onSelect={handleRelationshipSelect}
					label="和谁聊？👤"
				/>
			</div>
		{/if}
	</div>

	{#if topic}
		<div class="mt-8 animate-in fade-in zoom-in-95 duration-300">
			<TopicCard
				text={topic.text}
				tip={topic.tip}
				tags={topic.tags}
				onRefresh={refreshTopic}
			/>
		</div>
	{:else if $selectedSceneId && $selectedRelationshipId}
		<div class="mt-10 p-6 brutal-border bg-white rounded-[var(--radius-card)] text-center text-text-secondary brutal-shadow rotate-1">
			<p class="font-bold">暂时没有找到话题 🙉</p>
			<p class="text-sm mt-1">试试其他不可思议的组合？</p>
		</div>
	{:else if $selectedSceneId}
		<div class="mt-10 p-6 brutal-border bg-lavender/30 rounded-[var(--radius-card)] text-center text-text-primary brutal-shadow -rotate-1">
			<p class="font-bold">快选个人吧 👇</p>
			<p class="text-sm mt-1">选好了我就给你支招</p>
		</div>
	{/if}
</div>
