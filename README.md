# 社恐拯救者 (Social Anxiety Savior)

> 一款帮助社交焦虑人群应对日常社交场景的 Web 应用

[English Version](./README-EN.md)

![Version](https://img.shields.io/badge/version-0.0.1-blue)
![Svelte](https://img.shields.io/badge/Svelte-5.51+-FF7343)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6)

## 概述

社恐拯救者提供话题生成、消息回复建议等功能，采用温暖治愈风 UI 设计，降低用户焦虑感。

### 核心功能

| 功能 | 描述 |
|------|------|
| **话题生成器** | 选择场景和关系，生成适合打破僵局的话题 |
| **回复助手** | 粘贴收到的消息，获得多种语气的回复建议 |

### 设计风格

- **温暖治愈风**：柔和暖色调、圆角设计、轻柔动效
- 主色调：暖杏色 `#FFF0E5` 背景 + 珊瑚粉 `#FF8B7E` 强调色
- 辅助色：薄荷绿 `#A8E6CF`（成功）、淡紫 `#D4A5FF`（日记）

## 技术栈

- **框架**：SvelteKit + Vite + TypeScript
- **样式**：Tailwind CSS v4
- **图标**：Lucide Icons
- **测试**：Vitest + JSDOM

## 三阶段交付计划

| 阶段 | 功能 |
|------|------|
| Phase 1 | 话题生成器 + 消息回复助手 ✅ |
| Phase 2 | 场景话术库 + 勇气日记 |
| Phase 3 | AI 增强 + 账号系统 |

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
pnpm build
```

### 代码检查

```bash
pnpm check
```

## 项目结构

```
src/
├── lib/
│   ├── components/    # 可复用 UI 组件
│   ├── data/          # 模板 JSON 数据
│   ├── services/     # 存储适配器等服务层
│   ├── stores/       # Svelte stores（状态管理）
│   └── utils/        # 工具函数
├── routes/
│   ├── +layout.svelte   # 全局布局
│   ├── +page.svelte     # 首页 → 话题生成器
│   └── reply/           # 回复助手
└── app.css           # 全局样式
```

## 路由

| 路径 | 页面 | 阶段 |
|------|------|------|
| `/` | 话题生成器 | Phase 1 |
| `/reply` | 消息回复助手 | Phase 1 |
| `/scripts` | 场景话术库 | Phase 2 |
| `/diary` | 勇气日记 | Phase 2 |
| `/settings` | 个人设置 | Phase 3 |

## 许可证

MIT
