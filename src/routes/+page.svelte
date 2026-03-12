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
	<header class="mb-6">
		<div class="flex items-center gap-2 mb-1">
			<Sparkles size={24} class="text-coral" />
			<h1 class="text-xl font-bold">找话题</h1>
		</div>
		<p class="text-sm text-text-secondary">选择场景和关系，找到合适的话题</p>
	</header>

	<SceneSelector
		items={scenes.map(s => ({ id: s.id, label: s.label, icon: s.icon }))}
		selectedId={$selectedSceneId}
		onSelect={handleSceneSelect}
		label="什么场景？"
	/>

	{#if $relationships.length > 0}
		<SceneSelector
			items={$relationships.map(r => ({ id: r.id, label: r.label }))}
			selectedId={$selectedRelationshipId}
			onSelect={handleRelationshipSelect}
			label="和谁聊？"
		/>
	{/if}

	{#if topic}
		<div class="mt-4">
			<TopicCard
				text={topic.text}
				tip={topic.tip}
				tags={topic.tags}
				onRefresh={refreshTopic}
			/>
		</div>
	{:else if $selectedSceneId && $selectedRelationshipId}
		<div class="mt-8 text-center text-text-light">
			<p>暂时没有找到话题，试试其他组合？</p>
		</div>
	{:else if $selectedSceneId}
		<div class="mt-8 text-center text-text-light">
			<p>选择和谁聊天，就能找到合适的话题了</p>
		</div>
	{/if}
</div>
