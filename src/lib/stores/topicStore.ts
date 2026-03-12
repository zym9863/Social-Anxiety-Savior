import { writable, derived } from 'svelte/store';
import topicData from '$lib/data/topic-templates.json';

export const scenes = topicData.scenes;

export const selectedSceneId = writable<string>(scenes[0]?.id ?? '');
export const selectedRelationshipId = writable<string>('');

export const selectedScene = derived(selectedSceneId, ($id) =>
	scenes.find((s) => s.id === $id) ?? null
);

export const relationships = derived(selectedScene, ($scene) =>
	$scene?.relationships ?? []
);

export const currentTopics = derived(
	[selectedScene, selectedRelationshipId],
	([$scene, $relId]) => {
		if (!$scene) return [];
		const rel = $scene.relationships.find((r) => r.id === $relId);
		return rel?.topics ?? [];
	}
);

export function selectScene(id: string) {
	selectedSceneId.set(id);
	selectedRelationshipId.set('');
}

export function selectRelationship(id: string) {
	selectedRelationshipId.set(id);
}
