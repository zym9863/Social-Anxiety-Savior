# 社恐拯救者（Social Anxiety Savior）设计文档

## 概述

一款帮助社交焦虑人群应对日常社交场景的 Web 应用。提供话题生成、消息回复建议、场景话术库和社交勇气日记四大功能，采用温暖治愈风 UI 设计，降低用户焦虑感。

## 设计风格

**温暖治愈风**：柔和暖色调、圆角设计、轻柔动效，像一个温暖的朋友在身边。

| 设计元素 | 规范 |
|---------|------|
| 主色调 | 暖杏色 `#FFF0E5` 背景 + 珊瑚粉 `#FF8B7E` 强调色 |
| 辅助色 | 薄荷绿 `#A8E6CF`（成功/完成）、淡紫 `#D4A5FF`（日记） |
| 圆角 | 统一 `16px`，卡片 `20px` |
| 字体 | 中文：思源黑体 / 系统默认；英文：Inter |
| 图标 | Lucide Icons，圆润风格 |
| 动效 | 轻柔 fade + slide，`200-300ms ease-out` |

## 三阶段交付计划

| 阶段 | 功能 | 技术 | 数据存储 |
|------|------|------|---------|
| Phase 1 | 话题生成器 + 消息回复助手 | SvelteKit + Vite | localStorage |
| Phase 2 | 场景话术库 + 勇气日记 | + Supabase DB | Supabase PostgreSQL |
| Phase 3 | AI 增强 + 账号系统 | + Supabase Auth + AI API | 云端同步 |

## 技术栈

- **框架**：SvelteKit + Vite + TypeScript（strict mode）
- **样式**：Tailwind CSS（自定义 design tokens 通过 `tailwind.config.ts` 注入）
- **图标**：lucide-svelte
- **部署**：Vercel（`adapter-auto`）
- **目标平台**：移动端优先，响应式适配桌面端（断点：`sm: 640px`、`md: 768px`、`lg: 1024px`）
- **浏览器支持**：现代 evergreen 浏览器（Chrome/Edge 90+、Safari 15+、Firefox 90+）

## 架构

### 项目结构

```
social-anxiety-savior/
├── src/
│   ├── lib/
│   │   ├── components/    # 可复用 UI 组件
│   │   ├── data/          # 模板 JSON 数据
│   │   ├── services/      # 存储适配器等服务层
│   │   ├── stores/        # Svelte stores（状态管理）
│   │   └── utils/         # 工具函数（匹配算法等）
│   ├── routes/
│   │   ├── +layout.svelte # 全局布局（含 NavBar）
│   │   ├── +page.svelte   # 首页 → 话题生成器
│   │   └── reply/
│   │       └── +page.svelte # 回复助手
│   └── app.html
├── static/                # 静态资源
├── tailwind.config.ts
└── svelte.config.js
```

### 路由定义

| 路径 | 页面 | 阶段 |
|------|------|------|
| `/` | 话题生成器 | Phase 1 |
| `/reply` | 消息回复助手 | Phase 1 |
| `/scripts` | 场景话术库 | Phase 2 |
| `/diary` | 勇气日记 | Phase 2 |
| `/settings` | 个人设置 | Phase 3 |

### 关键设计决策

- **SvelteKit**（非纯 Svelte SPA）：文件路由 + 未来 SSR/API routes 能力对 Phase 2、3 至关重要
- **存储抽象层**：`lib/services/storageAdapter.ts` 封装持久化操作，stores 依赖该适配器。Phase 1 用 localStorage 实现，Phase 2 替换为 Supabase client
- **模板数据内嵌**：以 JSON 文件形式内嵌，Phase 3 时可选择迁移到数据库
- **移动端优先**：用户最可能在社交场景中用手机访问，所有交互优先适配触摸操作

### 存储适配器接口

```typescript
interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}
```

Phase 1 实现 `LocalStorageAdapter`，Phase 2 实现 `SupabaseStorageAdapter`，接口不变。

## Phase 1 功能详细设计

### 页面结构

底部导航栏（NavBar）两个 tab：

1. **话题生成器页** — 选择场景和关系，生成适合的话题
2. **回复助手页** — 粘贴收到的消息，获得多种语气的回复建议

### 数据模型

#### 话题模板（topic-templates.json）

```
按场景分类（聚餐/职场/约会/派对/初次见面/邻里）
└── 按关系分类（同事/朋友/暧昧对象/亲戚/陌生人）
    └── 话题条目
        ├── text: "最近有看什么好看的剧吗？"
        ├── tip: "轻松开场 · 适合破冰"
        └── tags: ["轻松", "万能"]
```

#### 回复模板（reply-templates.json）

```
按意图分类（接受邀请/拒绝邀请/回应问候/回应关心/日常闲聊）
└── 按语气分类（友好热情/礼貌得体/轻松随意/委婉拒绝）
    └── 回复条目
        ├── pattern: "一起吃饭|约饭|聚餐"  (消息匹配正则)
        ├── text: "好呀！你有想去的地方吗？"
        └── tip: "简洁自然 · 把选择权给对方"
```

### 模板匹配策略（回复助手核心逻辑）

Phase 1 采用**正则子串匹配**（不依赖分词库）：

1. 用户粘贴消息 → 直接用原文进行匹配
2. 遍历所有回复模板的 `pattern` 正则，对原文执行 `RegExp.test()`
3. 收集所有匹配的意图分类，按匹配数量排序
4. 结合选择的语气，从匹配池中随机抽取最多 3 条（最少 1 条）
5. 无匹配时，回退到 `generic` 通用回复模板池（每个语气至少 5 条）

> **已知局限**：中文无词边界，`"吃饭"` 无法匹配 `"吃个饭"`。Phase 1 通过编写更细粒度的字符级 pattern（如 `吃.*饭`）和充足的通用回复池来缓解。Phase 3 由 AI 彻底解决。

### 状态管理

```
stores/
├── topicStore.ts      # 话题生成器状态：选中场景、关系、生成结果
└── replyStore.ts      # 回复助手状态：输入消息、选中语气、生成结果
```

> `settingsStore` 推迟到 Phase 2（有实际设置项时）再引入。存储适配器位于 `lib/services/`，不在 stores 目录。

### UI 组件清单

- `SceneSelector` — 场景/关系选择器（标签云形式）
- `TopicCard` — 话题卡片（点击"换一个"按钮刷新，不依赖滑动手势）
- `MessageInput` — 消息粘贴输入框
- `ToneSelector` — 语气选择器（emoji + 文字标签）
- `ReplyCard` — 回复建议卡片（一键复制，复制后显示 toast 提示"已复制"）
- `NavBar` — 底部导航栏

## Phase 2 路线图

- **场景话术库**：按场景分类的可搜索话术列表，支持收藏
- **勇气日记**：日历视图 + 每日记录卡片，累计勇气值进度条
- **Supabase 集成**：PostgreSQL 存储话术库 + 日记数据，本地缓存兜底

## Phase 3 路线图

- **AI 回复生成**：接入 Claude API，基于用户粘贴的消息内容 + 选择的语气偏好生成个性化回复
- **账号系统**：Supabase Auth（邮箱 + Google OAuth）。微信 OAuth 需要企业资质和自定义 Provider，列为可选延伸目标
- **数据迁移**：首次登录自动上传 localStorage 数据到云端
