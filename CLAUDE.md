# CLAUDE.md - Kestrel Symphony

## Project Overview

Kestrel Symphony is an **AI-Native SDLC Orchestration Platform** built by Lumi AI (lumicorp.ai). It is the governed layer between an enterprise's backlog and their AI agent teams. It takes a Jira story, proposes an execution Blueprint (phases, agent roles, tools, cost estimate), orchestrates execution across Plan, Build, and Deploy with automated quality gates (tollgates) between every phase, and provides a Cockpit dashboard showing cost, quality, and full audit trail.

**Positioning**: Every developer has an AI coding assistant. Individual productivity is solved. But team-level delivery is still ungoverned, disconnected, and invisible. Symphony solves this. Today, organizations buy AI productivity per developer. With Symphony, they buy AI productivity per team.

**Target**: Enterprises spending $5-20M on outsourced development with multiple teams.

## Architecture (Three Layers)

### Layer 1: Role Cards (the catalog)
Curated AI agent roles, each a self-contained package of skills, sub-agents, hooks, commands, and MCP server configs. Each role has a `ROLE_CARD.yaml` declaring its inputs, outputs, and tollgate criteria. Roles work independently or as part of a team.

**Core Roles**: Requirements Dev, Process Leader, Data Steward, Agent Engineer, Code Auditor, UX Designer, Architect, Agent Ops

### Layer 2: Arc Composer (the wiring)
The tollgated workflow engine that connects roles into teams. "Define it. Arc builds it."
- Each role operates within a phase (Plan, Design, Build, Deploy)
- Tollgates enforce quality gates between phases
- **Enforced mode**: failures block the pipeline
- **Advisory mode**: failures warn but allow continuation
- **Override**: requires justification + immutable audit trail
- Criteria are weighted, scored, and customizable per phase
- Industry presets available (Healthcare, FinServ, Government)

### Layer 3: Kestrel Runtime (the platform)
Deployment, observability, cost tracking, audit logs, and enterprise admin controls. Provides the Cockpit dashboard with per-story economics and institutional memory.

## Engine-Agnostic Design

Symphony speaks two open protocols:
- **MCP (Model Context Protocol)** for connecting agents to tools (GitHub, Jira, Confluence, Snyk, etc.)
- **A2A (Agent-to-Agent Protocol)** for agent collaboration

The execution engine is pluggable: CrewAI, LangGraph, AutoGen, or Claude Agent SDK. The LLM is selectable per role (expensive reasoning model for architecture, fast model for code gen, open-source for internal tasks). The customer picks the engine that fits their infrastructure. Never locked into a single vendor.

## Three Compounding Advantages

1. **Feedback Loop** - Production incidents and performance data flow back into planning for future work. Teams never repeat the same mistakes.
2. **Knowledge Layer** - Across hundreds of stories, Symphony detects patterns no individual tool can see: fragile modules, risky change combinations, estimate misses. This institutional memory is the long-term moat.
3. **ROI Engine** - Every story shows before-and-after economics: time saved, cost reduced, quality improved. Measured data from actual execution, not projections.

## Interactive PoC (symphony-ui)

### Tech Stack
- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **State**: React useReducer with AppContext (Zustand-style)
- **Deployment**: Vercel (https://symphony-ui-nu.vercel.app)
- **Pitch Page**: /pitch route (business + architecture overview)

### Six Demo Views
| View | Route State | Description |
|------|-------------|-------------|
| Hero Splash | `hero` | Landing page with animated logo, enter demo |
| Jira Board | `board` | 7 sample stories, inline pipeline status, pull into Symphony |
| Blueprint | `blueprint` | Phase plan, agent config, LLM assignments, cost comparison, Adjust panel |
| Session | `session` | Multi-agent workspace, phase-specific messages, artifact panel, chat |
| Tollgate | `tollgate` | Arc evaluation with phase tabs, score rings, criteria cards, override |
| Cockpit | `cockpit` | Executive dashboard, per-story metrics, quality gauge, activity feed |

### Key UI Features
- **Dark/Light theme** toggle (light mode is default, uses CSS custom properties)
- **Platform Inspector** - 5-tab slide-out panel (Engine & LLM, Agent Wiring, Guardrails, Context Flow, Knowledge)
- **Arc Configuration** - Dedicated panel for tollgate criteria management (weights, thresholds, presets)
- **Adjust Panel** - Full config: roles, LLM models, tools, human mode per phase, cost budget
- **Provisioning Animation** - 10-second step-by-step agent team setup with progress bar
- **Phase Transitions** - Plan to Build to Deploy with tollgate between each
- **Agent Chat** - Context-aware replies from active agents using story data
- **Governance Modes** - Enforced vs Advisory toggle affects tollgate behavior

### Color System
- **Lumi Orange**: #FF6B2C (primary accent, sparingly)
- **Text**: blacks and dark greys (not light grey)
- **Backgrounds**: white (light mode), #0a0a0f (dark mode)
- **No blues, purples, or cyans** anywhere
- All components use CSS custom properties (var(--xxx)) for theme switching

### File Structure
```
symphony-ui/
  src/
    app/
      page.tsx              # Main app shell, theme state, view router
      globals.css           # CSS custom properties, theme system, glass effects
      pitch/page.tsx        # Standalone pitch + architecture page
    components/
      HeroSplash.tsx        # Landing page with animated logo
      BoardView.tsx         # Jira board with story cards
      BlueprintView.tsx     # Blueprint, Adjust panel, provisioning animation
      SessionView.tsx       # Multi-agent session workspace
      TollgateView.tsx      # Arc tollgate evaluation
      CockpitView.tsx       # Executive dashboard
      Navigation.tsx        # Top nav with theme toggle, inspector, Arc config
      PlatformInspector.tsx # 5-tab technical details panel
      FloatingOrbs.tsx      # Background animation (dark mode only)
    lib/
      store.ts              # State types, actions, reducer, context
      sample-data.ts        # 7 sample stories, blueprints, messages, role catalog
      roles.ts              # Role icon/color mappings
```

### State Management
Central reducer in `store.ts` with these key actions:
- `INIT_STORIES` - Load sample stories on mount
- `PULL_STORY` - Move story from backlog into Symphony
- `SET_ACTIVE_STORY` - Select story for blueprint/session
- `APPROVE_BLUEPRINT` - Creates phases and starts execution
- `START_PHASE` / `COMPLETE_PHASE` - Phase lifecycle
- `SET_TOLLGATE` / `OVERRIDE_TOLLGATE` - Tollgate evaluation
- `MARK_STORY_DONE` - Complete story lifecycle
- `SET_VIEW` - Navigate between views

### Development
```bash
cd symphony-ui
npm run dev            # Starts on localhost:3456
npx next build         # Production build check
npx vercel --prod      # Deploy to Vercel
```

## Naming Conventions

- Role directories: `lumi-{role-name}/`
- Skills: `skills/{skill-name}/SKILL.md`
- Sub-agents: `agents/{agent-name}.md`
- Hooks: `hooks/{hook-name}.js`
- Commands: `commands/{command-name}.md`
- MCP configs: `mcp-servers/{server-name}/config.json`

## Key Design Principles

1. **Ticket-centric, not role-centric** - The demo flow starts from a Jira story, not from picking roles. Roles are composed based on what the story needs.

2. **ROLE_CARD.yaml is the Symphony contract** - Declares inputs, outputs, and tollgate criteria. Engine-agnostic.

3. **Arc tollgates are the governance backbone** - Every phase transition is earned, not assumed. Enforced mode blocks, advisory mode warns.

4. **Engine-agnostic by design** - The engine is NOT the product. The composition layer (Role Catalog + Arc Composer + Kestrel Runtime) is. This avoids vendor lock-in objections.

5. **Conservative ROI claims** - 60-70% time reduction, 50-60% cost reduction. Defensible. Positioned as augmentation, not replacement.

6. **Every click and every word must be real** - No placeholder buttons, no fake data, no surface-level concepts. Built for CIO demos with technically savvy audiences.

## Lumi AI Context

- **Company**: Lumi AI Services and Products (lumicorp.ai)
- **Platform**: Kestrel - AI agent lifecycle management
- **Workflow Engine**: Arc - Multi-stage tollgated process engine ("Define it. Arc builds it.")
- **Advisory Platform**: NexaRevive (nexarevive.ai) - CheckDoors is the real estate vertical
- **CTO**: Greg
- **Positioning**: "Builders not consultants" - AI agents to production in 8 weeks
- **Market**: AI agent market $11B in 2026, growing to $50B by 2030. 40% of enterprise apps will include AI agents by year-end.
