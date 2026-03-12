# Social Anxiety Savior

> A Web App to Help People with Social Anxiety Navigate Daily Social Situations

[中文版本](./README.md)

![Version](https://img.shields.io/badge/version-0.0.1-blue)
![Svelte](https://img.shields.io/badge/Svelte-5.51+-FF7343)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6)

## Overview

Social Anxiety Savior provides topic generation and message reply suggestions, with a warm, healing UI design to reduce user anxiety.

### Core Features

| Feature | Description |
|---------|-------------|
| **Topic Generator** | Select scenarios and relationships to generate appropriate conversation starters |
| **Reply Assistant** | Paste received messages and get reply suggestions in various tones |

### Design Style

- **Warm & Healing**: Soft warm colors, rounded corners, gentle animations
- Primary: Warm Apricot `#FFF0E5` background + Coral Pink `#FF8B7E` accent
- Secondary: Mint Green `#A8E6CF` (success), Lavender `#D4A5FF` (diary)

## Tech Stack

- **Framework**: SvelteKit + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide Icons
- **Testing**: Vitest + JSDOM

## Three-Phase Delivery Plan

| Phase | Features |
|-------|----------|
| Phase 1 | Topic Generator + Reply Assistant ✅ |
| Phase 2 | Script Library + Courage Diary |
| Phase 3 | AI Enhancement + Account System |

## Quick Start

### Install Dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Visit http://localhost:5173 to view the app.

### Build for Production

```bash
pnpm build
```

### Type Check

```bash
pnpm check
```

## Project Structure

```
src/
├── lib/
│   ├── components/    # Reusable UI components
│   ├── data/          # Template JSON data
│   ├── services/     # Storage adapter and services
│   ├── stores/       # Svelte stores (state management)
│   └── utils/        # Utility functions
├── routes/
│   ├── +layout.svelte   # Global layout
│   ├── +page.svelte     # Home → Topic Generator
│   └── reply/           # Reply Assistant
└── app.css           # Global styles
```

## Routes

| Path | Page | Phase |
|------|------|-------|
| `/` | Topic Generator | Phase 1 |
| `/reply` | Reply Assistant | Phase 1 |
| `/scripts` | Script Library | Phase 2 |
| `/diary` | Courage Diary | Phase 2 |
| `/settings` | Settings | Phase 3 |

## License

MIT
