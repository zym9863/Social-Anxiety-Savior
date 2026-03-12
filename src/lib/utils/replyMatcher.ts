export interface ReplyEntry {
	text: string;
	tip: string;
}

export interface Intent {
	id: string;
	label: string;
	patterns: string[];
	replies: Record<string, ReplyEntry[]>;
}

export interface Tone {
	id: string;
	label: string;
	emoji: string;
}

export interface ReplyData {
	tones: Tone[];
	intents: Intent[];
	generic: Record<string, ReplyEntry[]>;
}

function shuffle<T>(arr: T[]): T[] {
	const result = [...arr];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

export function matchReplies(
	message: string,
	toneId: string,
	data: ReplyData,
	maxResults = 3
): ReplyEntry[] {
	const scored: Array<{ intent: Intent; matchCount: number }> = [];

	for (const intent of data.intents) {
		let matchCount = 0;
		for (const pattern of intent.patterns) {
			try {
				if (new RegExp(pattern).test(message)) matchCount++;
			} catch {
				// skip invalid regex
			}
		}
		if (matchCount > 0) {
			scored.push({ intent, matchCount });
		}
	}

	scored.sort((a, b) => b.matchCount - a.matchCount);

	const matched: ReplyEntry[] = [];
	for (const { intent } of scored) {
		const toneReplies = intent.replies[toneId] ?? [];
		matched.push(...toneReplies);
	}

	if (matched.length > 0) {
		return shuffle(matched).slice(0, maxResults);
	}

	const genericReplies = data.generic[toneId] ?? [];
	if (genericReplies.length > 0) {
		return shuffle(genericReplies).slice(0, maxResults);
	}

	for (const entries of Object.values(data.generic)) {
		if (entries.length > 0) {
			return [entries[0]];
		}
	}

	return [{ text: '嗯嗯，好的～', tip: '万能回应' }];
}
