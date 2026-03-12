import { writable, derived } from 'svelte/store';
import replyData from '$lib/data/reply-templates.json';
import { matchReplies } from '$lib/utils/replyMatcher';
import type { ReplyData } from '$lib/utils/replyMatcher';

export const tones = replyData.tones;

export const inputMessage = writable<string>('');
export const selectedToneId = writable<string>(tones[0]?.id ?? 'friendly');

export const replyResults = derived(
	[inputMessage, selectedToneId],
	([$message, $toneId]) => {
		if (!$message.trim()) return [];
		return matchReplies($message, $toneId, replyData as ReplyData);
	}
);

export function setMessage(msg: string) {
	inputMessage.set(msg);
}

export function selectTone(id: string) {
	selectedToneId.set(id);
}

export function clearMessage() {
	inputMessage.set('');
}
