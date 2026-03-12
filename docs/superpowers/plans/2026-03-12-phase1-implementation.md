# Phase 1 实现计划：话题生成器 + 消息回复助手

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现社恐拯救者 Phase 1——话题生成器和消息回复助手两大核心功能，移动端优先的温暖治愈风 Web 应用。

**Architecture:** SvelteKit 文件路由，两个页面（`/` 话题生成器、`/reply` 回复助手），底部 NavBar 导航。数据层使用 JSON 模板文件 + localStorage 存储适配器。回复匹配使用正则子串匹配算法。

**Tech Stack:** SvelteKit 2 + Svelte 5 + TypeScript (strict) + Tailwind CSS v4 (@tailwindcss/vite) + lucide-svelte + Vitest

**Spec:** `docs/superpowers/specs/2026-03-12-social-anxiety-savior-design.md`

---

## File Map

| 操作 | 文件路径 | 职责 |
|------|---------|------|
| Create | `package.json` | 项目依赖（由 sv create 生成） |
| Create | `vite.config.ts` | Vite 配置（tailwindcss + sveltekit 插件） |
| Create | `svelte.config.js` | SvelteKit 配置 |
| Create | `tsconfig.json` | TypeScript 配置 |
| Create | `src/app.html` | HTML 模板 |
| Create | `src/app.css` | 全局样式 + Tailwind 导入 + 自定义 design tokens |
| Create | `src/lib/services/storageAdapter.ts` | StorageAdapter 接口 + LocalStorageAdapter 实现 |
| Create | `src/lib/data/topic-templates.json` | 话题模板数据 |
| Create | `src/lib/data/reply-templates.json` | 回复模板数据 |
| Create | `src/lib/utils/replyMatcher.ts` | 正则子串匹配算法 |
| Create | `src/lib/stores/topicStore.ts` | 话题生成器状态管理 |
| Create | `src/lib/stores/replyStore.ts` | 回复助手状态管理 |
| Create | `src/lib/components/NavBar.svelte` | 底部导航栏 |
| Create | `src/lib/components/SceneSelector.svelte` | 场景/关系标签云选择器 |
| Create | `src/lib/components/TopicCard.svelte` | 话题卡片（换一个按钮） |
| Create | `src/lib/components/MessageInput.svelte` | 消息粘贴输入框 |
| Create | `src/lib/components/ToneSelector.svelte` | 语气选择器 |
| Create | `src/lib/components/ReplyCard.svelte` | 回复建议卡片（一键复制） |
| Create | `src/lib/components/Toast.svelte` | Toast 通知组件 |
| Create | `src/routes/+layout.svelte` | 全局布局（NavBar + 页面容器） |
| Create | `src/routes/+page.svelte` | 话题生成器页面 |
| Create | `src/routes/reply/+page.svelte` | 回复助手页面 |
| Create | `src/lib/services/storageAdapter.test.ts` | 存储适配器测试 |
| Create | `src/lib/utils/replyMatcher.test.ts` | 匹配算法测试 |

---

## Chunk 1: Project Setup & Infrastructure

### Task 1: Scaffold SvelteKit Project

**Files:**
- Create: `package.json`, `vite.config.ts`, `svelte.config.js`, `tsconfig.json`, `src/app.html`

- [ ] **Step 1: Create SvelteKit project with TypeScript**

```bash
cd "d:/github/Social Anxiety Savior"
npx sv create . --template minimal --types ts
```

Accept defaults. This scaffolds the base project structure. Note: `sv create` initializes a git repository automatically. If it does not, run `git init` before proceeding.

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

- [ ] **Step 3: Install additional dependencies**

```bash
npm install -D @tailwindcss/vite lucide-svelte vitest jsdom svelte-check typescript
```

- [ ] **Step 4: Configure Vite with Tailwind CSS v4 plugin**

Edit `vite.config.ts`:

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit()
	],
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'jsdom'
	}
});
```

Note: `tailwindcss()` MUST be before `sveltekit()` in the plugins array.

> **Spec deviation:** The spec lists `tailwind.config.ts` in the project structure, but Tailwind CSS v4 uses CSS-first configuration via `@theme {}` in `app.css` instead. No `tailwind.config.ts` file is needed.

- [ ] **Step 5: Create global CSS with Tailwind and design tokens**

Create `src/app.css`:

```css
@import "tailwindcss";

@theme {
	--color-warm-bg: #FFF0E5;
	--color-warm-bg-light: #FFF8F2;
	--color-coral: #FF8B7E;
	--color-coral-light: #FFB4AC;
	--color-coral-dark: #E5706A;
	--color-mint: #A8E6CF;
	--color-mint-light: #C8F0DF;
	--color-lavender: #D4A5FF;
	--color-lavender-light: #E8CCFF;
	--color-text-primary: #4A3728;
	--color-text-secondary: #8B7355;
	--color-text-light: #B8A08A;
	--radius-base: 16px;
	--radius-card: 20px;
	--font-sans: "Inter", "Noto Sans SC", system-ui, sans-serif;
}
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on `localhost:5173` without errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold SvelteKit project with Tailwind CSS v4 and TypeScript"
```

---

### Task 2: Storage Adapter — Tests

> **Note:** StorageAdapter is intentionally scaffolded for Phase 2 (Supabase migration). It is not consumed by Phase 1 stores, but establishing the interface now prevents a breaking refactor later.

**Files:**
- Create: `src/lib/services/storageAdapter.test.ts`

- [ ] **Step 1: Write failing tests for StorageAdapter**

Create `src/lib/services/storageAdapter.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageAdapter } from './storageAdapter';

describe('LocalStorageAdapter', () => {
	let adapter: LocalStorageAdapter;

	beforeEach(() => {
		localStorage.clear();
		adapter = new LocalStorageAdapter();
	});

	it('should return null for non-existent key', async () => {
		const result = await adapter.get('nonexistent');
		expect(result).toBeNull();
	});

	it('should set and get a value', async () => {
		await adapter.set('key1', { name: 'test' });
		const result = await adapter.get<{ name: string }>('key1');
		expect(result).toEqual({ name: 'test' });
	});

	it('should overwrite existing value', async () => {
		await adapter.set('key1', 'old');
		await adapter.set('key1', 'new');
		const result = await adapter.get('key1');
		expect(result).toBe('new');
	});

	it('should remove a value', async () => {
		await adapter.set('key1', 'value');
		await adapter.remove('key1');
		const result = await adapter.get('key1');
		expect(result).toBeNull();
	});

	it('should list keys with prefix', async () => {
		await adapter.set('topic:1', 'a');
		await adapter.set('topic:2', 'b');
		await adapter.set('reply:1', 'c');
		const keys = await adapter.list('topic:');
		expect(keys).toEqual(['topic:1', 'topic:2']);
	});

	it('should return empty array when no keys match prefix', async () => {
		await adapter.set('topic:1', 'a');
		const keys = await adapter.list('reply:');
		expect(keys).toEqual([]);
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/services/storageAdapter.test.ts
```

Expected: FAIL — `Cannot find module './storageAdapter'`

---

### Task 3: Storage Adapter — Implementation

**Files:**
- Create: `src/lib/services/storageAdapter.ts`

- [ ] **Step 1: Implement StorageAdapter interface and LocalStorageAdapter**

Create `src/lib/services/storageAdapter.ts`:

```typescript
export interface StorageAdapter {
	get<T>(key: string): Promise<T | null>;
	set<T>(key: string, value: T): Promise<void>;
	remove(key: string): Promise<void>;
	list(prefix: string): Promise<string[]>;
}

export class LocalStorageAdapter implements StorageAdapter {
	async get<T>(key: string): Promise<T | null> {
		const raw = localStorage.getItem(key);
		if (raw === null) return null;
		return JSON.parse(raw) as T;
	}

	async set<T>(key: string, value: T): Promise<void> {
		localStorage.setItem(key, JSON.stringify(value));
	}

	async remove(key: string): Promise<void> {
		localStorage.removeItem(key);
	}

	async list(prefix: string): Promise<string[]> {
		const keys: string[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key !== null && key.startsWith(prefix)) {
				keys.push(key);
			}
		}
		return keys;
	}
}
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npx vitest run src/lib/services/storageAdapter.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/services/storageAdapter.ts src/lib/services/storageAdapter.test.ts
git commit -m "feat: add StorageAdapter interface and LocalStorageAdapter implementation"
```

---

## Chunk 2: Data Layer & Matching Algorithm

### Task 4: Topic Template Data

**Files:**
- Create: `src/lib/data/topic-templates.json`

- [ ] **Step 1: Create topic templates JSON**

Create `src/lib/data/topic-templates.json` with the following structure. **You MUST generate the complete data** — at least 3 topics per scene-relationship combination, covering all 6 scenes × 5 relationship types = 30 combinations, minimum 90 topic entries total. The example below shows just one scene/relationship for structure reference. Fill ALL combinations with natural, realistic Chinese social topics appropriate for socially anxious users.

场景列表（对应 icon）：`dinner`/`utensils`（聚餐）、`workplace`/`briefcase`（职场）、`date`/`heart`（约会）、`party`/`party-popper`（派对）、`first-meet`/`user-plus`（初次见面）、`neighbor`/`home`（邻里）
关系列表：`colleague`（同事）、`friend`（朋友）、`crush`（暧昧对象）、`relative`（亲戚）、`stranger`（陌生人）

话题要求：自然、安全、不涉及隐私、适合社恐人群使用。每个话题附带 `tip`（使用场景建议）和 `tags`（1-3 个标签，如"轻松""美食""万能"等）。

```json
{
  "scenes": [
    {
      "id": "dinner",
      "label": "聚餐",
      "icon": "utensils",
      "relationships": [
        {
          "id": "colleague",
          "label": "同事",
          "topics": [
            {
              "text": "最近有没有发现公司附近好吃的店？",
              "tip": "轻松开场 · 共同话题",
              "tags": ["轻松", "美食"]
            }
          ]
        }
      ]
    }
  ]
}
```

每个 topic 条目包含 `text`（话题文本）、`tip`（使用提示）、`tags`（标签数组）。

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/lib/data/topic-templates.json','utf8')); console.log('Valid JSON')"
```

Expected: `Valid JSON`

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/topic-templates.json
git commit -m "feat: add topic template data (6 scenes × 5 relationships)"
```

---

### Task 5: Reply Template Data

**Files:**
- Create: `src/lib/data/reply-templates.json`

- [ ] **Step 1: Create reply templates JSON**

Create `src/lib/data/reply-templates.json` with the following structure. **You MUST generate the complete data** — 5 个意图分类 × 4 种语气，每种组合至少 3 条回复（共 60+ 条）。另外 `generic` 通用池每种语气至少 5 条（共 20+ 条）。下面只展示一个意图的结构示例，你需要填充所有 5 个意图的全部回复。

意图列表：`accept_invite`（接受邀请）、`decline_invite`（拒绝邀请）、`respond_greeting`（回应问候）、`respond_care`（回应关心）、`casual_chat`（日常闲聊）
语气列表：`friendly`（友好热情）、`polite`（礼貌得体）、`casual`（轻松随意）、`gentle_decline`（委婉拒绝）

回复要求：自然口语化，符合中文社交习惯。`pattern` 正则要使用字符级匹配（如 `吃.*饭` 而非 `吃饭`）以提高匹配率。每条回复附带 `tip` 说明使用场景。

```json
{
  "tones": [
    { "id": "friendly", "label": "友好热情", "emoji": "😊" },
    { "id": "polite", "label": "礼貌得体", "emoji": "🤝" },
    { "id": "casual", "label": "轻松随意", "emoji": "😎" },
    { "id": "gentle_decline", "label": "委婉拒绝", "emoji": "🙏" }
  ],
  "intents": [
    {
      "id": "accept_invite",
      "label": "接受邀请",
      "patterns": ["一起.*吃", "约.*饭", "聚餐", "一起.*玩", "要不要.*来", "出来.*坐坐"],
      "replies": {
        "friendly": [
          { "text": "好呀好呀！你有想去的地方吗？", "tip": "热情回应 · 把选择权给对方" }
        ],
        "polite": [
          { "text": "好的，谢谢邀请！时间地点你定就好。", "tip": "得体回应 · 表达感谢" }
        ],
        "casual": [
          { "text": "行啊，去哪吃？", "tip": "简短干脆 · 不拖泥带水" }
        ],
        "gentle_decline": [
          { "text": "听起来不错，不过最近有点忙，下次一定！", "tip": "先肯定再婉拒 · 留余地" }
        ]
      }
    }
  ],
  "generic": {
    "friendly": [
      { "text": "哈哈，是这样的～", "tip": "万能回应 · 轻松自然" }
    ],
    "polite": [
      { "text": "嗯嗯，了解了，谢谢你告诉我。", "tip": "万能回应 · 礼貌得体" }
    ],
    "casual": [
      { "text": "哦哦，好的～", "tip": "万能回应 · 简短随意" }
    ],
    "gentle_decline": [
      { "text": "嗯，我再想想哈。", "tip": "万能回应 · 不立即表态" }
    ]
  }
}
```

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/lib/data/reply-templates.json','utf8')); console.log('Valid JSON')"
```

Expected: `Valid JSON`

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/reply-templates.json
git commit -m "feat: add reply template data (5 intents × 4 tones + generic pool)"
```

---

### Task 6: Reply Matcher — Tests

**Files:**
- Create: `src/lib/utils/replyMatcher.test.ts`

- [ ] **Step 1: Write failing tests for replyMatcher**

Create `src/lib/utils/replyMatcher.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { matchReplies } from './replyMatcher';
import type { ReplyData } from './replyMatcher';

// Minimal test fixture
const testData: ReplyData = {
	tones: [
		{ id: 'friendly', label: '友好热情', emoji: '😊' },
		{ id: 'polite', label: '礼貌得体', emoji: '🤝' }
	],
	intents: [
		{
			id: 'accept_invite',
			label: '接受邀请',
			patterns: ['一起.*吃', '约.*饭', '聚餐'],
			replies: {
				friendly: [
					{ text: '好呀！你有想去的地方吗？', tip: '热情回应' },
					{ text: '太好了！我正好饿了～', tip: '积极回应' },
					{ text: '好的好的，走起！', tip: '爽快回应' }
				],
				polite: [
					{ text: '好的，谢谢邀请。', tip: '得体回应' }
				]
			}
		},
		{
			id: 'respond_greeting',
			label: '回应问候',
			patterns: ['你好', '嗨', '在吗'],
			replies: {
				friendly: [
					{ text: '嗨嗨！好久不见～', tip: '热情问候' }
				],
				polite: [
					{ text: '你好，最近还好吗？', tip: '礼貌问候' }
				]
			}
		}
	],
	generic: {
		friendly: [
			{ text: '哈哈是这样的～', tip: '万能回应' },
			{ text: '嗯嗯好的呀！', tip: '万能回应' }
		],
		polite: [
			{ text: '嗯嗯，了解了。', tip: '万能回应' }
		]
	}
};

describe('matchReplies', () => {
	it('should match invite-related messages', () => {
		const results = matchReplies('要不要一起吃个饭呀', 'friendly', testData);
		expect(results.length).toBeGreaterThanOrEqual(1);
		expect(results.length).toBeLessThanOrEqual(3);
		results.forEach(r => {
			expect(r).toHaveProperty('text');
			expect(r).toHaveProperty('tip');
		});
	});

	it('should match greeting messages', () => {
		const results = matchReplies('你好呀', 'polite', testData);
		expect(results.length).toBeGreaterThanOrEqual(1);
		expect(results[0].text).toContain('你好');
	});

	it('should fall back to generic when no pattern matches', () => {
		const results = matchReplies('今天天气真不错啊', 'friendly', testData);
		expect(results.length).toBeGreaterThanOrEqual(1);
		// Should come from generic pool
		expect(results.some(r => r.text.includes('哈哈') || r.text.includes('嗯嗯'))).toBe(true);
	});

	it('should return at most 3 results', () => {
		const results = matchReplies('一起吃饭吧', 'friendly', testData);
		expect(results.length).toBeLessThanOrEqual(3);
	});

	it('should return at least 1 result even from generic', () => {
		const results = matchReplies('啊啊啊啊啊', 'polite', testData);
		expect(results.length).toBeGreaterThanOrEqual(1);
	});

	it('should handle empty message gracefully', () => {
		const results = matchReplies('', 'friendly', testData);
		expect(results.length).toBeGreaterThanOrEqual(1);
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/utils/replyMatcher.test.ts
```

Expected: FAIL — `Cannot find module './replyMatcher'`

---

### Task 7: Reply Matcher — Implementation

**Files:**
- Create: `src/lib/utils/replyMatcher.ts`

- [ ] **Step 1: Implement replyMatcher**

Create `src/lib/utils/replyMatcher.ts`:

```typescript
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
	// Score each intent by how many patterns match
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

	// Sort by match count descending (higher = more relevant)
	scored.sort((a, b) => b.matchCount - a.matchCount);

	// Collect replies from matched intents in relevance order
	const matched: ReplyEntry[] = [];
	for (const { intent } of scored) {
		const toneReplies = intent.replies[toneId] ?? [];
		matched.push(...toneReplies);
	}

	if (matched.length > 0) {
		return shuffle(matched).slice(0, maxResults);
	}

	// Fallback to generic pool
	const genericReplies = data.generic[toneId] ?? [];
	if (genericReplies.length > 0) {
		return shuffle(genericReplies).slice(0, maxResults);
	}

	// Last resort: return first available generic from any tone
	for (const entries of Object.values(data.generic)) {
		if (entries.length > 0) {
			return [entries[0]];
		}
	}

	return [{ text: '嗯嗯，好的～', tip: '万能回应' }];
}
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npx vitest run src/lib/utils/replyMatcher.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils/replyMatcher.ts src/lib/utils/replyMatcher.test.ts
git commit -m "feat: add reply matching algorithm with regex pattern matching and fallback"
```

---

## Chunk 3: Stores & Shared Components

### Task 8: Svelte Stores

**Files:**
- Create: `src/lib/stores/topicStore.ts`
- Create: `src/lib/stores/replyStore.ts`

- [ ] **Step 1: Create topicStore**

Create `src/lib/stores/topicStore.ts`:

```typescript
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
```

- [ ] **Step 2: Create replyStore**

Create `src/lib/stores/replyStore.ts`:

```typescript
import { writable, derived } from 'svelte/store';
import replyData from '$lib/data/reply-templates.json';
import { matchReplies } from '$lib/utils/replyMatcher';
import type { ReplyData, ReplyEntry } from '$lib/utils/replyMatcher';

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
```

- [ ] **Step 3: Verify TypeScript compilation**

```bash
npx svelte-check --tsconfig ./tsconfig.json
```

Expected: `svelte-check` exits with code 0 (0 errors, 0 warnings).

- [ ] **Step 4: Commit**

```bash
git add src/lib/stores/topicStore.ts src/lib/stores/replyStore.ts
git commit -m "feat: add topic and reply Svelte stores with derived state"
```

---

### Task 9: Toast Component

**Files:**
- Create: `src/lib/components/Toast.svelte`

- [ ] **Step 1: Create Toast component**

Create `src/lib/components/Toast.svelte`:

```svelte
<script lang="ts">
	import { fly, fade } from 'svelte/transition';

	let {
		message = '',
		visible = $bindable(false),
		duration = 2000
	}: {
		message?: string;
		visible?: boolean;
		duration?: number;
	} = $props();

	let timeoutId: ReturnType<typeof setTimeout>;

	$effect(() => {
		if (visible) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				visible = false;
			}, duration);
		}
	});
</script>

{#if visible}
	<div
		class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50
		       bg-text-primary text-warm-bg px-5 py-2.5
		       rounded-[var(--radius-base)] text-sm font-medium shadow-lg"
		in:fly={{ y: 20, duration: 200 }}
		out:fade={{ duration: 150 }}
		role="status"
		aria-live="polite"
	>
		{message}
	</div>
{/if}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/Toast.svelte
git commit -m "feat: add Toast notification component with auto-dismiss"
```

---

### Task 10: NavBar Component

**Files:**
- Create: `src/lib/components/NavBar.svelte`

- [ ] **Step 1: Create NavBar component**

Create `src/lib/components/NavBar.svelte`:

```svelte
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/NavBar.svelte
git commit -m "feat: add NavBar bottom navigation component"
```

---

### Task 11: Global Layout

**Files:**
- Create: `src/routes/+layout.svelte`

- [ ] **Step 1: Create global layout**

Create `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>社恐拯救者</title>
	<meta name="description" content="帮助社交焦虑人群应对日常社交场景" />
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="min-h-svh bg-warm-bg text-text-primary font-sans">
	<main class="max-w-lg mx-auto px-4 pt-6 pb-24">
		{@render children()}
	</main>
	<NavBar />
</div>
```

- [ ] **Step 2: Verify layout renders**

```bash
npm run dev
```

Open `http://localhost:5173` — should see warm background with bottom navigation bar.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat: add global layout with NavBar, warm theme, and font loading"
```

---

## Chunk 4: Topic Generator Page

### Task 12: SceneSelector Component

**Files:**
- Create: `src/lib/components/SceneSelector.svelte`

- [ ] **Step 1: Create SceneSelector**

Create `src/lib/components/SceneSelector.svelte`:

```svelte
<script lang="ts">
	import type { Component } from 'svelte';
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

	const iconMap: Record<string, Component> = {
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/SceneSelector.svelte
git commit -m "feat: add SceneSelector tag-cloud component with icon support"
```

---

### Task 13: TopicCard Component

**Files:**
- Create: `src/lib/components/TopicCard.svelte`

- [ ] **Step 1: Create TopicCard**

Create `src/lib/components/TopicCard.svelte`:

```svelte
<script lang="ts">
	import { fly } from 'svelte/transition';
	import { RefreshCw, Copy } from 'lucide-svelte';
	import Toast from './Toast.svelte';

	let {
		text = '',
		tip = '',
		tags = [] as string[],
		onRefresh
	}: {
		text?: string;
		tip?: string;
		tags?: string[];
		onRefresh?: () => void;
	} = $props();

	let toastVisible = $state(false);
	let animKey = $state(0);

	async function copyToClipboard() {
		await navigator.clipboard.writeText(text);
		toastVisible = true;
	}

	function handleRefresh() {
		animKey++;
		onRefresh?.();
	}
</script>

{#if text}
	{#key animKey}
		<div
			class="bg-white rounded-[var(--radius-card)] p-5 shadow-sm
			       border border-coral/10"
			in:fly={{ y: 10, duration: 250 }}
		>
			<p class="text-lg leading-relaxed text-text-primary mb-3">
				"{text}"
			</p>

			{#if tip}
				<p class="text-xs text-text-light mb-3">{tip}</p>
			{/if}

			{#if tags.length > 0}
				<div class="flex flex-wrap gap-1.5 mb-4">
					{#each tags as tag}
						<span class="text-xs px-2 py-0.5 rounded-full bg-warm-bg text-text-secondary">
							{tag}
						</span>
					{/each}
				</div>
			{/if}

			<div class="flex gap-2">
				<button
					class="flex-1 flex items-center justify-center gap-1.5
					       py-2.5 rounded-[var(--radius-base)]
					       bg-coral text-white text-sm font-medium
					       hover:bg-coral-dark transition-colors duration-200
					       active:scale-[0.98]"
					onclick={handleRefresh}
				>
					<RefreshCw size={15} />
					换一个
				</button>
				<button
					class="flex items-center justify-center gap-1.5
					       py-2.5 px-4 rounded-[var(--radius-base)]
					       bg-warm-bg text-text-secondary text-sm font-medium
					       hover:bg-coral-light/20 transition-colors duration-200
					       active:scale-[0.98]"
					onclick={copyToClipboard}
				>
					<Copy size={15} />
					复制
				</button>
			</div>
		</div>
	{/key}
{/if}

<Toast message="已复制到剪贴板 ✓" bind:visible={toastVisible} />
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/TopicCard.svelte
git commit -m "feat: add TopicCard component with copy and refresh actions"
```

---

### Task 14: Topic Generator Page

**Files:**
- Create: `src/routes/+page.svelte`

- [ ] **Step 1: Create topic generator page**

Create `src/routes/+page.svelte`:

```svelte
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

	// Svelte 5 derived values from stores
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
			<p>选择和谁聊天，就能找到合适的话题了 💬</p>
		</div>
	{/if}
</div>
```

- [ ] **Step 2: Verify page renders in browser**

```bash
npm run dev
```

Open `http://localhost:5173` — 应看到话题生成器界面。选择场景 → 选择关系 → 出现话题卡片。

- [ ] **Step 3: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: add topic generator page with scene/relationship selection"
```

---

## Chunk 5: Reply Assistant Page

### Task 15: MessageInput Component

**Files:**
- Create: `src/lib/components/MessageInput.svelte`

- [ ] **Step 1: Create MessageInput**

Create `src/lib/components/MessageInput.svelte`:

```svelte
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/MessageInput.svelte
git commit -m "feat: add MessageInput component with clear button"
```

---

### Task 16: ToneSelector Component

**Files:**
- Create: `src/lib/components/ToneSelector.svelte`

- [ ] **Step 1: Create ToneSelector**

Create `src/lib/components/ToneSelector.svelte`:

```svelte
<script lang="ts">
	let {
		tones,
		selectedId = '',
		onSelect
	}: {
		tones: Array<{ id: string; label: string; emoji: string }>;
		selectedId?: string;
		onSelect: (id: string) => void;
	} = $props();
</script>

<div class="mb-4">
	<p class="text-sm text-text-secondary mb-2 font-medium">选个语气</p>
	<div class="flex gap-2">
		{#each tones as tone}
			{@const isActive = tone.id === selectedId}
			<button
				class="flex-1 flex flex-col items-center gap-1
				       py-3 rounded-[var(--radius-base)]
				       text-sm font-medium
				       transition-all duration-200
				       {isActive
				         ? 'bg-coral text-white shadow-md shadow-coral/25'
				         : 'bg-white text-text-secondary hover:bg-coral-light/20'}"
				onclick={() => onSelect(tone.id)}
			>
				<span class="text-lg">{tone.emoji}</span>
				<span class="text-xs">{tone.label}</span>
			</button>
		{/each}
	</div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/ToneSelector.svelte
git commit -m "feat: add ToneSelector emoji-based tone picker"
```

---

### Task 17: ReplyCard Component

**Files:**
- Create: `src/lib/components/ReplyCard.svelte`

- [ ] **Step 1: Create ReplyCard**

Create `src/lib/components/ReplyCard.svelte`:

```svelte
<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Copy, Check } from 'lucide-svelte';

	let {
		text = '',
		tip = '',
		index = 0
	}: {
		text?: string;
		tip?: string;
		index?: number;
	} = $props();

	let copied = $state(false);

	async function copyToClipboard() {
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => { copied = false; }, 1500);
	}
</script>

<div
	class="bg-white rounded-[var(--radius-card)] p-4
	       border border-coral/10 shadow-sm"
	in:fly={{ y: 10, duration: 200, delay: index * 80 }}
>
	<p class="text-sm leading-relaxed text-text-primary mb-2">
		{text}
	</p>

	<div class="flex items-center justify-between">
		{#if tip}
			<span class="text-xs text-text-light">{tip}</span>
		{:else}
			<span></span>
		{/if}

		<button
			class="inline-flex items-center gap-1
			       text-xs px-3 py-1.5 rounded-full
			       transition-all duration-200
			       {copied
			         ? 'bg-mint/30 text-green-700'
			         : 'bg-warm-bg text-text-secondary hover:bg-coral-light/20 hover:text-coral'}"
			onclick={copyToClipboard}
		>
			{#if copied}
				<Check size={13} />
				已复制
			{:else}
				<Copy size={13} />
				复制
			{/if}
		</button>
	</div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/components/ReplyCard.svelte
git commit -m "feat: add ReplyCard component with inline copy feedback"
```

---

### Task 18: Reply Assistant Page

**Files:**
- Create: `src/routes/reply/+page.svelte`

- [ ] **Step 1: Create reply assistant page**

Create `src/routes/reply/+page.svelte`:

```svelte
<script lang="ts">
	import MessageInput from '$lib/components/MessageInput.svelte';
	import ToneSelector from '$lib/components/ToneSelector.svelte';
	import ReplyCard from '$lib/components/ReplyCard.svelte';
	import {
		tones,
		inputMessage,
		selectedToneId,
		replyResults,
		setMessage,
		selectTone,
		clearMessage
	} from '$lib/stores/replyStore';
	import { MessageCircle } from 'lucide-svelte';
</script>

<div>
	<header class="mb-6">
		<div class="flex items-center gap-2 mb-1">
			<MessageCircle size={24} class="text-coral" />
			<h1 class="text-xl font-bold">回消息</h1>
		</div>
		<p class="text-sm text-text-secondary">粘贴收到的消息，帮你想好怎么回</p>
	</header>

	<MessageInput
		value={$inputMessage}
		onInput={setMessage}
		onClear={clearMessage}
	/>

	<div class="mt-4">
		<ToneSelector
			{tones}
			selectedId={$selectedToneId}
			onSelect={selectTone}
		/>
	</div>

	{#if $replyResults.length > 0}
		<div class="space-y-3 mt-4">
			<p class="text-sm text-text-secondary font-medium">
				试试这样回复 ✨
			</p>
			{#each $replyResults as reply, i (reply.text)}
				<ReplyCard
					text={reply.text}
					tip={reply.tip}
					index={i}
				/>
			{/each}
		</div>
	{:else if $inputMessage.trim()}
		<div class="mt-8 text-center text-text-light text-sm">
			<p>正在思考怎么回复...</p>
		</div>
	{:else}
		<div class="mt-8 text-center text-text-light text-sm">
			<p>把别人发给你的消息粘贴到上面 👆</p>
			<p class="mt-1">我来帮你想想怎么回复</p>
		</div>
	{/if}
</div>
```

- [ ] **Step 2: Verify full app in browser**

```bash
npm run dev
```

测试流程：
1. 首页：选场景 → 选关系 → 看到话题卡片 → 点击"换一个"→ 点击"复制"
2. 回复助手页：粘贴消息 → 选语气 → 看到回复建议 → 点击"复制"

- [ ] **Step 3: Commit**

```bash
git add src/routes/reply/+page.svelte
git commit -m "feat: add reply assistant page with message matching and tone selection"
```

---

## Chunk 6: Build Verification & Final Polish

### Task 19: Run All Tests

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```

Expected: All tests pass (storageAdapter + replyMatcher).

- [ ] **Step 2: Run TypeScript check**

```bash
npx svelte-check --tsconfig ./tsconfig.json
```

Expected: No errors.

---

### Task 20: Production Build

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds without errors.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Open preview URL, verify both pages work correctly.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: verify build and tests pass for Phase 1 completion"
```

---

## Summary

| Chunk | Tasks | 内容 |
|-------|-------|------|
| 1 | 1-3 | 项目脚手架 + 存储适配器（TDD） |
| 2 | 4-7 | 模板数据 + 匹配算法（TDD） |
| 3 | 8-11 | Stores + Toast + NavBar + 全局布局 |
| 4 | 12-14 | SceneSelector + TopicCard + 话题生成器页面 |
| 5 | 15-18 | MessageInput + ToneSelector + ReplyCard + 回复助手页面 |
| 6 | 19-20 | 测试验证 + 生产构建 |

**依赖关系：** Chunk 1 → Chunk 2 → Chunk 3（Stores 依赖数据和匹配器）→ Chunk 4 和 Chunk 5 可并行 → Chunk 6
