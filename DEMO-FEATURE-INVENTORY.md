# Kestrel Symphony UI — Product Feature Inventory

**Generated**: 2026-03-21
**Source**: All 15 source files in `symphony-ui/src/`
**Version**: Demo Build v0.5
**Deployment**: https://symphony-ui-nu.vercel.app

---

## 1. ROUTE MAP

| URL Path | Component | Description |
|----------|-----------|-------------|
| `/` | `page.tsx` (Home) | Main SPA shell. Uses `currentView` state to render one of 7 views: hero, board, blueprint, session, tollgate, arc, cockpit. No URL-based routing for views; all navigation is state-driven via `SET_VIEW` dispatch. |
| `/pitch` | `pitch/page.tsx` (PitchPage) | Standalone long-form marketing/architecture page. Separate Next.js route with its own header. Always renders in light-on-dark style regardless of theme toggle. |

**Note**: The main app is a single-page application. The 7 "views" (hero, board, blueprint, session, tollgate, arc, cockpit) are rendered via `AnimatePresence` keyed on `state.currentView`. The only true URL route distinction is `/` vs `/pitch`.

---

## 2. NAVIGATION STRUCTURE

### 2.1 Top Navigation Bar (`Navigation.tsx`)
Visible on all views except Hero. Fixed at top, 56px height, glass-morphism backdrop blur.

**Left side:**
- **Logo button** (Kestrel icon + "Symphony" text + Lumi logo) — Clicking returns to Hero (`SET_VIEW: hero`)

**Center:**
- **5 nav items** (pill-shaped buttons with icons, animated active indicator via `layoutId`):
  1. **Board** (Kanban icon) — `SET_VIEW: board`
  2. **Blueprint** (FileSearch icon) — `SET_VIEW: blueprint`
  3. **Session** (MessageSquare icon) — `SET_VIEW: session`
  4. **Tollgate** (ShieldCheck icon) — `SET_VIEW: tollgate`
  5. **Cockpit** (BarChart3 icon) — `SET_VIEW: cockpit`

**Right side (left to right):**
- **Active story indicator** — Mono badge showing the Jira key (e.g., "NCP-1252") of `state.activeStoryId`. Only visible when a story is selected.
- **Arc button** (GitBranch icon + "Arc") — `SET_VIEW: arc`. Highlighted with orange gradient when active.
- **Theme toggle** (Sun/Moon icon) — Toggles `data-theme` between `"dark"` and `"light"` on document body.
- **Platform button** (Settings icon + "Platform") — Toggles the PlatformInspector slide-out panel open/closed.
- **Governance mode toggle** — Two-button segmented control:
  - **Enforced** (red when active) — `SET_GOVERNANCE: enforced`
  - **Advisory** (amber when active) — `SET_GOVERNANCE: advisory`
- **About link** — `<a href="/pitch">` with ArrowRight icon. Opens in same tab.
- **Online status** — Pulsing green dot + "Online" text with breathing opacity animation.

### 2.2 Primary Demo Flow (happy path)
```
Hero → [Enter Demo] → Board → [Pull Story] → Blueprint → [Approve] →
Session → [Complete Phase] → Tollgate → [Continue] →
Session (next phase) → Tollgate → [Mark Complete] → Cockpit
```

### 2.3 Alternate Paths
- **Board → click in_symphony story** → Session (if active) or Cockpit (if done)
- **Tollgate → Override** → Re-run Tollgate → Continue
- **Tollgate → Return to Session** (for failed tollgates)
- **Blueprint → Reject** → Back to Board
- **Blueprint → Adjust** → Opens AdjustPanel inline
- **Cockpit → click active story** → Session
- **Cockpit → click done story** → Tollgate
- **Any view → Arc button** → Arc Configuration view
- **Any view → Platform button** → PlatformInspector slide-out

---

## 3. FEATURE INVENTORY

### 3.1 Hero Splash (`HeroSplash.tsx`)

**Purpose**: Landing page introducing Kestrel Symphony with animated branding.

**Visual Layout**:
- Full-screen centered column layout
- Background: Large radial gradient orb (700px diameter) with breathing scale/opacity animation
- Floating dots: 3 orbiting dots around the logo with unique keyframe paths

**Data Displayed**:
- Kestrel logo (rounded gradient square with bird icon)
- Headline: "AI-Native SDLC Orchestration"
- Subheadline: "The governed layer between your backlog and your AI tools."
- Tagline (italic): "Today you buy AI productivity per developer. With Symphony, you buy AI productivity per team."
- 3 value proposition cards:
  - "10x Team Productivity" (Users icon)
  - "Governed by Default" (Shield icon)
  - "Engine Agnostic" (Cpu icon)
- 6 tech stack badges: Claude, CrewAI, Supabase, MCP, A2A, Langfuse
- Lumi AI logo (bottom)
- Confidentiality badge: "Confidential - Demo Build v0.5"

**Interactive Elements**:
| Element | Action |
|---------|--------|
| "Enter Demo" button (orange gradient, ArrowRight icon) | `SET_VIEW: board` |
| "About Symphony" link (subtle text, ArrowRight icon) | Navigates to `/pitch` |

**Modals/Overlays**: None.

**State Dependencies**: `dispatch` only (no read from state).

**Animations**:
- Staggered fade-up for all content sections (0.15s delay between groups)
- Logo floating (4s cycle, 8px vertical)
- 3 orbiting dots with independent multi-keyframe paths (14-18s cycles)
- Background orb: breathing scale (1 to 1.15) and opacity (0.4 to 0.65), 10s cycle
- Enter Demo button: whileHover scale 1.04, whileTap scale 0.97
- Value prop cards: glass-card hover lift effect

**Simulated vs Real**: **Simulated** — All content is hardcoded. No API calls.

---

### 3.2 Board View (`BoardView.tsx`)

**Purpose**: Kanban-style Jira board showing project stories across 4 status columns.

**Visual Layout**:
- Header: "NextGen Customer Portal" with sprint info and "X in Symphony" badge
- 4-column grid: Backlog, Ready, In Symphony, Done
- Each column has: colored dot header, count badge, story cards

**Data Displayed per Story Card**:
- Jira key (monospace, e.g., "NCP-1247")
- Priority dot (color-coded: critical=red, high=orange, medium=yellow, low=grey)
- Title text
- Type badge (Feature/Bug/Spike/Epic with icon and background color)
- Component tag (e.g., "auth", "data")
- Story points (e.g., "8 SP")
- Check mark for done stories

**Interactive Elements**:
| Element | Action |
|---------|--------|
| "Pull into Symphony" button (on Ready stories) | Triggers 3-second analyzing animation, then: generates blueprint, sets status to `in_symphony`, sets active story, navigates to Blueprint view |
| Click on In Symphony story card | Sets active story, navigates to Session view |
| Click on Done story card | Sets active story, navigates to Cockpit view |

**Modals/Overlays**:
- **AnalyzingSteps overlay**: Appears over the story card during pull. Shows spinning loader + 4 sequential status messages with 700ms delay between each:
  1. "Fetching acceptance criteria..."
  2. "Scanning codebase for affected modules..."
  3. "Checking historical data..."
  4. "Generating blueprint..."

**Additional Sub-components**:
- **MiniPipeline**: Inline phase progress dots shown on In Symphony cards. Each phase shows a colored dot (green=passed, orange=active with pulse, red=failed, grey=pending) with phase name and status icon.

**State Dependencies**: `state.stories` (filtered by status), `state.activeStoryId` (for highlighting).

**Animations**:
- Cards: layout animation via Framer Motion, fade-in/out with popLayout mode
- Pull button: whileHover scale 1.02
- In Symphony cards: whileHover orange border glow + lift
- Active phase dots: scale pulse animation (1 to 1.3, 1.5s cycle)
- Analyzing overlay: spinner rotation, sequential text appearance

**Simulated vs Real**: **Simulated** — All 8 stories are from `SAMPLE_STORIES`. The "Pull into Symphony" action uses `setTimeout(3000)` to simulate analysis. Blueprint generation is deterministic via `generateBlueprint()`.

---

### 3.3 Blueprint View (`BlueprintView.tsx`)

**Purpose**: Shows the AI-generated execution plan for a selected story with phase details, cost estimates, and configuration options.

**Visual Layout**:
- "Back to Board" link (top left)
- Story header: Jira key + title, type badge, priority badge, component tag, story points, labels
- "Knowledge Layer Insight" section: Blueprint reasoning text (amber background)
- Phase pipeline: Horizontal cards connected by chevron arrows
- Cost comparison panel: Symphony vs Traditional side-by-side with savings percentages
- Action buttons: Approve + Reject (or "Return to Board" if already approved)
- Adjust panel (expandable inline section)

**Data Displayed per Phase Card**:
- Phase number and name (color-coded left border)
- Human mode badge (Collaborative/Review/Delegated with description)
- Role chips (icon + name with role-specific color)
- Tool badges (wrench icon + name)
- Time estimate (minutes)
- Cost estimate (dollars)

**Data Displayed in Cost Comparison**:
- Traditional: X dev-hours, $Y cost
- Symphony: X minutes, $Y cost
- Time saved: X%
- Cost saved: X%
- Similar stories referenced (e.g., "NCP-1089, NCP-1134")

**Interactive Elements**:
| Element | Action |
|---------|--------|
| "Back to Board" link | `SET_VIEW: board` |
| "Approve Blueprint" button (orange gradient) | Dispatches `APPROVE_BLUEPRINT`, starts first phase, triggers 10-second provisioning animation, then navigates to Session |
| "Reject" button | Clears active story, returns to Board |
| "Adjust" button (Settings icon) | Opens/closes AdjustPanel inline |

**Modals/Overlays**:
- **ProvisioningSteps overlay**: Full-screen overlay during 10-second setup animation after approval. Shows progress bar (0-100%) and 11 sequential steps:
  1. "Initializing Symphony runtime..."
  2. "Provisioning agent roles (Requirements Dev, Process Leader)..."
  3. "Connecting MCP: GitHub - OAuth token verified"
  4. "Connecting MCP: Jira - API key verified"
  5. "Connecting MCP: Confluence - OAuth token verified"
  6. "Loading knowledge repository (147 stories, 23 patterns)..."
  7. "Applying guardrails: token budget 50K, cost cap $15.00..."
  8. "Applying guardrails: PII filter, dependency audit..."
  9. "Setting governance mode: Enforced..."
  10. "Running pre-flight checks..."
  11. "All systems ready. Entering Plan phase..."

  Steps appear every 850ms with green checkmarks for completed steps.

**AdjustPanel (inline config panel)**:
Grid of columns, one per phase, each containing:
- **Roles**: Checkboxes for all 8 roles in the catalog
- **LLM Model per role**: Dropdown selects (Claude Opus 4.6 / Claude Sonnet 4 / Claude Haiku 4.5)
- **Human Mode**: Radio buttons (Collaborative / Review / Delegated)
- **Budget Cap**: Number input (defaults to 2x estimated cost)
- **Save Changes** button (shows "Saved!" confirmation for 1.2s, then closes)
- **Cancel** button

**State Dependencies**: `state.activeStoryId`, `state.stories` (to find story + blueprint).

**Animations**:
- Phase cards: staggered fade-up (0.12s delay per card)
- Connector chevrons: delayed scale-in
- AdjustPanel: height expand/collapse animation
- Provisioning: progress bar animation, step-by-step text reveal with x-slide

**Simulated vs Real**: **Simulated** — Blueprint data is generated by `generateBlueprint()` using deterministic hashing. The Adjust Panel reads but does not persist changes (inputs are `defaultValue` only). Provisioning animation is pure `setTimeout`. Cost comparison data comes from `historicalComparison` in the blueprint.

---

### 3.4 Session View (`SessionView.tsx`)

**Purpose**: Multi-agent workspace showing real-time agent collaboration, chat messages, artifacts, and activity log for the active phase.

**Visual Layout**:
- Three-column layout:
  - **Left sidebar** (~200px): Phase timeline with clickable phase nodes
  - **Center** (flex-1): Agent chat messages with typing indicators and input box
  - **Right sidebar** (~280px): Tabbed panel for Artifacts and Activity Log

**Left Sidebar (Phase Timeline)**:
- Vertical timeline with connected nodes for each phase
- Each node shows: phase name, status icon, tollgate score badge, role list
- "View Handover Manifest" button on passed phases with artifacts

**Center Panel (Agent Chat)**:
- **LiveActivityBar** at top: Progress bar, agent status chips (active/done/waiting)
- **Chat messages** (scrollable): Each message shows:
  - RoleAvatar (circular icon with role color, pulse dot when active)
  - Role name (colored)
  - "referencing [Role]" badge (when cross-referencing another agent)
  - Timestamp
  - Message content (glass-styled bubble)
  - Artifact chips (clickable, colored by role)
- **TypingIndicator**: Shows when an agent is "working" with Terminal icon, spinning loader, and cycling activity descriptions
- **Chat input**: Text input + Send button at bottom. User can type messages and get contextual agent replies.

**Right Sidebar (Artifacts + Log)**:
- Tab switcher: "Artifacts" | "Log"
- **Artifacts tab**: List of ArtifactCards showing:
  - File type icon (spec/code/test/config/doc)
  - Artifact name
  - "from [Role]" badge
  - Preview text (monospace, 2-line clamp)
  - "new" badge on recently added artifacts (pulsing)
  - Click to expand: shows full preview in an overlay
- **Log tab**: Chronological SessionLogEntry items showing:
  - Timestamp (monospace)
  - Action badge (color-coded: green for "Role joined", orange for "Phase started", red for "Security finding", etc.)
  - Role name, tool name, details
  - "new" dot indicator on recent entries

**Interactive Elements**:
| Element | Action |
|---------|--------|
| Phase timeline nodes | Switch displayed phase (loads different messages/artifacts) |
| "View Handover Manifest" button | Opens HandoverManifestModal slide-over |
| Chat input + Send button | Adds user message, triggers 1.5s typing indicator, then generates contextual agent reply via `generateAgentReply()` |
| "Complete Phase" button (appears when all messages shown) | Dispatches `COMPLETE_PHASE`, shows PhaseCompleteOverlay |
| Artifact chips in messages | Click (hover effect only, no navigation) |
| ArtifactCard click | Opens expanded artifact view |
| "Artifacts" / "Log" tabs | Switches right sidebar content |

**Modals/Overlays**:
- **PhaseCompleteOverlay**: Full-screen overlay with animated checkmark (64px, scale+rotate animation). Shows "Phase Complete" heading, description, and two buttons:
  - "Stay in Session" — Dismisses overlay
  - "Run Tollgate Evaluation" (orange gradient + ShieldCheck icon) — Dispatches `COMPLETE_PHASE`, sets tollgate, navigates to Tollgate view
- **HandoverManifestModal**: Right-edge slide-over (max-w-md) showing:
  - Phase transition label (e.g., "Plan -> Build")
  - Artifacts list with type icons
  - Key Decisions list (checkmark icons)
  - Risks & Watch Items list (warning icons)
  - Close button
- **Expanded Artifact overlay**: Shows full artifact preview text

**State Dependencies**: `state.activeStoryId`, `state.stories` (active story), `state.activePhaseId`, `state.governanceMode`.

**Animations**:
- Messages: Timed reveal (one message every ~1.5-3s via setTimeout chain)
- Typing indicator: spinning Loader2, opacity pulse on "working" label, activity text cycling
- Agent status chips: border color pulse when active
- Progress bar: animated width
- Artifact "new" badge: opacity pulse (3 repetitions)
- Log entries: staggered x-slide entrance
- Phase complete: checkmark scale+rotate, spring-based card entrance

**Simulated vs Real**: **Simulated** — Messages come from pre-built arrays (`RBAC_PLAN_MESSAGES`, `RBAC_BUILD_MESSAGES`, `RBAC_DEPLOY_MESSAGES`) for story s6, or are generated via `generateSessionMessages()` for other stories. Agent replies are generated locally by `generateAgentReply()` using keyword matching on user input. Message reveal is timed via `setTimeout`. Typing activities cycle through hardcoded arrays in `AGENT_ACTIVITIES`.

---

### 3.5 Tollgate View (`TollgateView.tsx`)

**Purpose**: Arc tollgate evaluation showing pass/fail results, criterion scores, override controls, and handover manifest.

**Visual Layout**:
- **Story tabs** (top): Horizontal tab bar for all stories with phases. Shows Jira key with pass/fail icon.
- **Two-column layout**:
  - **Left (w-64)**: Phase Timeline with clickable nodes, "Powered by Arc" branding badge
  - **Right (flex-1)**: Tollgate evaluation details

**Right Panel Content (when tollgate exists)**:
- **Header**: "Tollgate Evaluation" with Arc branding, story key, phase name, governance mode badge (Enforced/Advisory with Lock/Unlock icon), evaluation timestamp
- **Action buttons** (inline with header):
  - "Continue to next phase" or "Mark Story Complete" (when passed/overridden)
  - "Return to Session" (when failed)
- **ScoreRing**: Large SVG ring (140px) with animated stroke dash. Displays score number and PASSED/FAILED text. Green gradient for pass, red for fail. Outer glow shadow pulses.
- **3 summary cards**: Criteria Passed (X/Y), Overall Score (X%), Governance Mode
- **SecurityFinding panel** (if CVE detected): Red-bordered card with CVE ID, description, and green remediation box
- **OverridePanel** (if failed): "Override Tollgate" button that expands to show:
  - Authorizing Lead field (pre-filled "Sarah Chen - Tech Lead")
  - Justification textarea (required)
  - "Confirm Override" button (disabled until text entered)
  - Cancel button
- **OverrideAuditBanner** (if overridden): Red double-bordered card with warning icon, override details (who, when, justification in quotes), "Logged to audit trail" note
- **Criteria grid**: 2-3 column grid of CriterionCards, sorted failed-first

**CriterionCard content**:
- Large score number
- "score" label
- Thin progress ring (48px SVG) with check/X icon center
- Criterion name
- Description
- Failure details footer (red, only when failed)

**PhaseTimelineItem content** (left sidebar):
- Clickable circular node (40px): Clock icon (pending), CheckCircle (passed), XCircle (failed), pulsing dot (active)
- Vertical connector line between nodes
- Phase name, tollgate score badge, role list
- "View Handover Manifest" button (on passed phases with artifacts)

**Interactive Elements**:
| Element | Action |
|---------|--------|
| Story tabs | Switches between stories, resets selected phase |
| Phase timeline nodes | Switches displayed phase |
| "Continue to next phase" button | Dispatches `COMPLETE_PHASE`, `START_PHASE` for next, navigates to Session |
| "Mark Story Complete" button (last phase) | Dispatches `MARK_STORY_DONE`, navigates to Cockpit |
| "Return to Session" button | `SET_VIEW: session` |
| "Override Tollgate" button | Expands override panel |
| "Confirm Override" button | Dispatches `OVERRIDE_TOLLGATE` with justification |
| "Re-run Tollgate" button | 2-second loading, then dispatches `RERUN_TOLLGATE` (passes if override was applied, fails otherwise) |
| "View Handover Manifest" button | Opens HandoverManifestModal |

**Modals/Overlays**:
- **HandoverManifestModal**: Same slide-over as SessionView. Shows artifacts, key decisions, risks for the selected phase.

**State Dependencies**: `state.stories` (all with phases), `state.activeStoryId`, `state.activePhaseId`, `state.governanceMode`.

**Animations**:
- ScoreRing: animated stroke-dashoffset (1.2s ease-out), score number scale-in, outer glow pulse (2.5s cycle)
- Criterion cards: staggered fade-up (0.08s delay per card)
- Re-run: 2-second loading spinner
- Override panel: slide-down with opacity
- Audit banner: slide-down
- SecurityFinding: delayed fade-up
- Handover modal: slide-in from right (x: 400 to 0)

**Simulated vs Real**: **Simulated** — Tollgate results are generated in the `COMPLETE_PHASE` reducer using hardcoded criteria templates per phase. Override is tracked in local component state and synced to store. Re-run logic is a simple setTimeout with hardcoded score adjustment. CVE details are hardcoded for story s7.

---

### 3.6 Cockpit View (`CockpitView.tsx`)

**Purpose**: Executive dashboard showing sprint ROI, quality metrics, cost breakdown, active stories, and live audit trail.

**Visual Layout**:
- **Header**: "Executive Cockpit" label, sprint info, live pulse indicator, live token counter
- **ROI Hero Card** (full width): Symphony vs Traditional comparison with animated counters
- **4 Metric Cards** (2x2 on mobile, 4-column on desktop)
- **2-Column Section**: Active Stories + Cost Breakdown
- **Full-Width Section**: Audit Trail (2/3) + Quality Trends (1/3)

**Data Displayed**:

*ROI Hero Card:*
- Symphony hours (animated counter) and cost
- Traditional hours (animated counter, struck through) and cost
- "X% time saved" badge (green, with Zap icon, glowing animation)
- "X% cost saved" badge (green, with DollarSign icon)
- Bar chart comparing Symphony vs Traditional hours (animated bars)

*4 Metric Cards:*
1. **Stories**: Completed/Total with progress bar
2. **Tollgate Avg**: Average score (green, glowing text shadow animation)
3. **Security Caught**: Count of issues caught by Code Auditor
4. **Overrides**: Count with pulsing amber dot

*Active Stories panel:*
- In-progress stories with: Jira key, priority badge, "live" indicator (pulsing), current phase badge, phase dots
- Click navigates to Session view
- "Recently completed" section with done stories (click navigates to Tollgate)

*Cost Breakdown panel:*
- Table: Role | Cost | Tokens | Model for each of 5 roles
- Total row with live cost accumulation
- Live cost increment display

*Audit Trail:*
- Chronological event log with: time, event badge (color-coded by severity), story key, detail text
- New entries animate in from left with orange background flash
- Critical entries have pulsing inset box-shadow
- LivePulse indicator

*Quality Trends:*
- Sparkline bar chart (10 bars, last bar green) with hover tooltips
- "Trending up" indicator
- Pass rate percentage
- Average score
- Live Activity feed: 2 agents with pulsing status dots

**Interactive Elements**:
| Element | Action |
|---------|--------|
| Active story cards | `SET_ACTIVE_STORY` + `SET_VIEW: session` |
| Done story cards | `SET_ACTIVE_STORY` + `SET_VIEW: tollgate` |
| Quality trend bar hover | Shows score tooltip |

**Modals/Overlays**: None.

**State Dependencies**: `state.stories` (for computing sprint metrics), `COCKPIT_METRICS` (static data for ROI, quality, cost breakdown, audit trail).

**Animations**:
- Staggered card entrance (0.07s delay between items)
- AnimatedCounter: ease-out cubic counting animation (1.5s default)
- ROI bars: delayed height animation
- Metric progress bars: delayed width animation
- Time/cost saved badges: glowing box-shadow pulse
- Live token counter: border color pulse
- Audit entries: staggered x-slide entrance
- Quality bars: staggered height animation
- Live activity dots: scale pulse + opacity pulse

**Simulated vs Real**: **Simulated** — All metrics come from `COCKPIT_METRICS` (hardcoded). Sprint counts are computed from actual story state. Live token/cost counters increment via `setInterval(2500)` with random amounts, capped at maximums. Live audit entries are injected via `setInterval(4000)`, capped at 10 additions.

---

### 3.7 Arc Configuration View (`ArcView.tsx`)

**Purpose**: Dedicated configuration panel for managing tollgate criteria, weights, thresholds, governance rules, and industry presets.

**Visual Layout**:
- **Header**: "Arc Configuration" with GitBranch icon, "Governance Engine" subtitle
- **Phase Pipeline**: 3 clickable phase nodes (Plan, Build, Deploy) connected by animated arrows with flowing particles
- **Active phase content** (below pipeline):
  - Governance mode toggle per phase (Enforced/Advisory)
  - Pass threshold slider (0-100 with percentage display)
  - Criteria list with toggles, weight selectors, and fail action dropdowns
  - "Add Criterion" button
- **Governance Rules** section: Global rules with toggle switches
- **Industry Presets** section: 4 preset cards
- **Save/Reset buttons** at bottom

**Phase Pipeline Component**:
- 3 large clickable nodes numbered 1-2-3 (Plan, Build, Deploy)
- Active node has colored border, glow shadow, "Editing" label
- Inactive nodes show "Click to configure"
- Animated connector lines between nodes with flowing ArrowRight particles

**Per-Phase Configuration**:
- **Governance Mode**: Enforced/Advisory segmented toggle
- **Pass Threshold**: Range input (0-100) with live percentage display
- **Criteria List**: Each criterion shows:
  - Toggle switch (enabled/disabled, orange gradient when on)
  - Name + description
  - Weight selector (dropdown: 1-3, labeled Low/Medium/High)
  - Fail Action selector (custom dropdown component):
    - Block (red, Lock icon)
    - Warn (amber, AlertTriangle icon)
    - Escalate (blue, Eye icon)
- **"+ Add Criterion" button**: Appends a new blank criterion to the list

**Governance Rules** (global, 7 rules):
1. Override requires justification (on by default)
2. Failed security = auto-block (on)
3. Max 2 retries before escalation (on)
4. Audit trail immutable (on)
5. Cost ceiling enforcement (on)
6. PII detection in outputs (off by default)
7. Mandatory human review for PRs > 500 lines (on)

**Industry Presets** (4 cards):
1. Default — Standard SDLC governance
2. Healthcare — HIPAA-compliant with PHI detection
3. Financial Services — SOX compliance, PCI-DSS
4. Government — FedRAMP aligned, NIST controls

Each preset is a clickable card that would apply preset criteria/rules.

**Interactive Elements**:
| Element | Action |
|---------|--------|
| Phase pipeline nodes | Selects active phase for editing |
| Governance mode toggle | Switches Enforced/Advisory per phase |
| Pass threshold slider | Adjusts minimum score for pass |
| Criterion toggle | Enables/disables criterion |
| Weight dropdown | Sets criterion weight (1-3) |
| Fail Action dropdown | Sets block/warn/escalate per criterion |
| "+ Add Criterion" button | Adds new criterion row |
| Governance rule toggles | Enables/disables global rules |
| Industry preset cards | Click to select (shows green check) |
| "Save Configuration" button | Shows "Saved!" for 1.5s, resets |
| "Reset to Defaults" button | Resets all state to defaults |

**State Dependencies**: `state.governanceMode` (read-only). All configuration is local component state.

**Animations**:
- Staggered entrance for all sections
- Phase pipeline: connector line fill animation, flowing arrow particles (2s cycle)
- Active phase node: glow shadow, dot indicator via layoutId
- Toggle switch: spring animation for thumb position
- FailAction dropdown: AnimatePresence fade
- Criteria rows: staggered entrance
- Save button: green flash confirmation

**Simulated vs Real**: **Interactive but local** — All criteria, thresholds, modes, and rules are editable in the UI and stored in local React state. Changes are not persisted to any backend, not dispatched to the global store, and are lost on navigation. The "Save" button shows a visual confirmation but does not persist data.

---

### 3.8 Pitch Page (`pitch/page.tsx`)

**Purpose**: Standalone business and architecture overview page for executive audiences.

**Visual Layout**: Long-form scrolling page with alternating dark/light sections.

**Sections** (in order):
1. **Header** (fixed): Lumi AI logo + "View Live Demo" link
2. **Hero** (dark bg): Kestrel logo with orbiting dots, "KESTREL SYMPHONY" headline, "AI-Native SDLC Orchestration Platform" subtitle, problem statement text, "View Live Demo" CTA + "Talk to Us" secondary CTA
3. **The Gap** (white bg): 3-column cards — "Individual AI" (solved, green), "Team AI" (missing, red), "The Gap" (critical, orange)
4. **The Solution** (light grey bg): What Symphony does description
5. **Additional content sections** (various architecture, ROI, and competitive positioning sections with icons and animated entrance effects)

**Interactive Elements**:
| Element | Action |
|---------|--------|
| "View Live Demo" button (header) | Link to `/` |
| "View Live Demo" button (hero) | Link to `/` |
| "Talk to Us" button | Link to `https://lumicorp.ai` (opens new tab) |

**Modals/Overlays**: None.

**Animations**:
- 30 floating dots in hero with random positions and breathing opacity
- Logo orbiting dots (same as main Hero)
- All sections use `whileInView` fade-up animations
- Staggered card entrances (0.12s delay)

**Simulated vs Real**: **Simulated** — Entirely static marketing content. No dynamic data.

---

### 3.9 Platform Inspector (`PlatformInspector.tsx`)

**Purpose**: 5-tab slide-out panel showing technical platform configuration and diagnostics.

**Visual Layout**: Right-edge slide-out panel (max-w-lg, full height), backdrop blur overlay.

**5 Tabs**:

#### Tab 1: Engine & LLM (`EngineTab`)
- **Orchestration Engine** selection:
  - Selected: "CrewAI Flows v0.4.2" with "selected" badge
  - Engine dropdown (when in edit mode): CrewAI Flows / LangGraph / AutoGen
  - Selection rationale text
  - 2 alternative engine cards with fit percentage bars (LangGraph 72%, AutoGen 58%)
- **LLM Routing Per Role** table:
  - 5 rows (Requirements Dev, Process Leader, Agent Engineer, Code Auditor, Agent Ops)
  - Each row: role name (colored), arrow, model name (colored by provider), cost per 1K tokens, rationale, token usage bar
  - Model dropdown in edit mode: Claude Opus 4.6, Claude Sonnet 4, Claude Haiku 4.5, GPT-4o, GPT-4o mini, o3, o4-mini, Gemini 2.5 Pro, Gemini 2.5 Flash, Llama 4 405B, Mistral Large, DeepSeek R1
  - Total LLM cost for story at bottom

#### Tab 2: Agent Wiring (`WiringTab`)
- **Agent Connections (Live)** list:
  - Each connection: From agent -> To agent/tool, protocol badge (A2A/MCP), direction arrow (bidirectional/inbound/outbound), message count, active pulse dot
  - In edit mode: delete button per wire, dropdowns for from/to/protocol
  - "Add Connection" section in edit mode
- **MCP Server Status** list:
  - 6 MCP connections: GitHub, Jira, Confluence, Snyk, Supabase, CloudWatch
  - Each shows: status (connected/idle), call count, last call time, auth method

#### Tab 3: Guardrails
- **Resource Limits** (3 progress bars):
  - Token Budget: used/limit with color-coded bar
  - Cost Cap: used/limit
  - Quality Floor: current/minimum
- **Rules** list (8 items):
  - Token limit per story, Cost cap, Quality floor, Auto-pause, Max tollgate retries, Sensitive data filter, Code review required, Dependency check
  - Each shows: status badge (healthy/armed/active), name, value

#### Tab 4: Context Flow
- **Phase-to-phase handoff** visualization:
  - Plan -> Build: artifact list with tokens, key decisions, risks, context strategy, tokens saved percentage
  - Build -> Deploy: same structure
  - Each artifact shows name, size, token count, delivery status

#### Tab 5: Knowledge
- **Detected Patterns** (3 patterns):
  - Auth module: 3/8 stories failed security tollgate, auto-adding Code Auditor
  - Search module: 2 performance regressions, auto-adding perf benchmark
  - Data module: 2.3x longer than estimated, adjusted estimates +40%
  - Each shows: module, finding, action, confidence percentage, impact level
- **Feedback This Run** (3 entries):
  - Timestamped entries from agents adding to knowledge base
- **Repository Stats**:
  - 147 stories processed, 23 patterns detected, 8 guardrails added, +12% quality improvement

**Interactive Elements**:
| Element | Action |
|---------|--------|
| Close button (X) | Closes inspector panel |
| Tab buttons (5 tabs) | Switches displayed tab |
| "Edit Configuration" toggle | Enables edit mode with dropdowns and inputs in Engine and Wiring tabs |
| Engine dropdown (edit mode) | Selects orchestration engine |
| LLM model dropdowns (edit mode) | Changes LLM per role |
| "Add Connection" button (edit mode) | Adds new wiring entry |
| Wire delete buttons (edit mode) | Removes wiring entry |
| Protocol/direction dropdowns (edit mode) | Configures connection details |

**Modals/Overlays**: The inspector itself is an overlay (backdrop click closes it).

**State Dependencies**: `state.stories` (active story blueprint for dynamic routing), `state.activeStoryId`.

**Animations**:
- Panel: slide in from right (x: 500 to 0, 0.4s spring)
- Backdrop: fade in
- All tab content: staggered row entrance
- Progress bars: animated width
- MCP status dots: pulse animation for connected servers
- Active wiring dots: scale pulse

**Simulated vs Real**: **Interactive but local** — Edit mode allows changing engines, LLM models, and wiring, but changes are not persisted. All data comes from hardcoded constants (`ENGINE_CONFIG`, `AGENT_WIRING`, `MCP_CONNECTIONS`, `GUARDRAILS`, `CONTEXT_FLOW`, `KNOWLEDGE`). When an active story with a blueprint exists, the Engine and Wiring tabs dynamically derive their display from the blueprint's phases/roles/tools.

---

### 3.10 Floating Orbs (`FloatingOrbs.tsx`)

**Purpose**: Ambient background decoration for dark mode.

**Visual Layout**: Fixed full-screen overlay (z-0, pointer-events-none) with:
- Grid overlay (60px squares, very subtle white lines with radial mask)
- 5 floating orbs (200-400px radial gradients, heavily blurred)
- Noise texture overlay (SVG fractalNoise at 2% opacity)

**Visibility**: Only rendered when `theme === "dark"` (controlled by `page.tsx`).

**Animations**: Each orb has unique multi-keyframe x/y/scale animation (22-35s cycles).

**Simulated vs Real**: **Simulated** — Pure decorative animation.

---

## 4. COMPONENT LIBRARY

### Internal Components (defined within view files)

| Component | File | What It Renders | Key Props |
|-----------|------|-----------------|-----------|
| `MiniPipeline` | BoardView.tsx | Inline phase progress dots with status icons | `phases: PhaseState[]` |
| `AnalyzingSteps` | BoardView.tsx | 4-step loading animation during story pull | None (self-contained timer) |
| `StoryCard` | BoardView.tsx | Kanban card with type/priority/points/pipeline | `story, onPull?, onOpen?, isPulling?` |
| `PhaseCard` | BlueprintView.tsx | Blueprint phase card with roles/tools/estimates | `phase: BlueprintPhase, index, total` |
| `RoleChip` | BlueprintView.tsx | Colored pill with role icon and name | `name: string` |
| `ToolBadge` | BlueprintView.tsx | Grey pill with wrench icon and tool name | `name: string` |
| `ProvisioningSteps` | BlueprintView.tsx | 11-step loading animation with progress bar | None (self-contained timer) |
| `AdjustPanel` | BlueprintView.tsx | Full blueprint config panel (roles, LLM, human mode, budget) | `phases: BlueprintPhase[], onClose` |
| `RoleAvatar` | SessionView.tsx | Circular icon with role color and optional active pulse | `role, color, active?, size?` |
| `McpBadge` | SessionView.tsx | Small MCP connection status badge | `name, connected?` |
| `TypingIndicator` | SessionView.tsx | Agent working indicator with terminal activity text | `role, color, activity` |
| `LiveActivityBar` | SessionView.tsx | Progress bar with agent status chips | `agents[], progress` |
| `ChatMessage` | SessionView.tsx | Chat bubble with role avatar, content, artifact chips | `msg: SessionMessage, index` |
| `ArtifactCard` | SessionView.tsx | Expandable artifact display with preview | `artifact, isNew?, onExpand?` |
| `LogEntry` | SessionView.tsx | Activity log row with timestamp and action badge | `entry: SessionLogEntry, isNew?` |
| `PhaseCompleteOverlay` | SessionView.tsx | Full-screen celebration with proceed buttons | `onStay, onTollgate, phaseName?` |
| `ScoreRing` | TollgateView.tsx | SVG circular progress ring with score display | `score, passed, size?` |
| `CriterionCard` | TollgateView.tsx | Criterion evaluation card with ring and details | `criterion, index` |
| `OverridePanel` | TollgateView.tsx | Expandable override form with justification textarea | `tollgate, onOverride` |
| `OverrideAuditBanner` | TollgateView.tsx | Red alert banner showing override audit record | `tollgate` |
| `SecurityFinding` | TollgateView.tsx | CVE detail card with remediation | `criterion` |
| `HandoverManifestModal` | TollgateView.tsx | Right slide-over showing phase handoff details | `phase, nextPhase?, onClose` |
| `PhaseTimelineItem` | TollgateView.tsx | Vertical timeline node with status and actions | `phase, isLast, isSelected, onClick, onViewHandover?` |
| `AnimatedCounter` | CockpitView.tsx | Number counting animation (ease-out cubic) | `target, duration?, prefix?, suffix?, decimals?` |
| `RoiBarChart` | CockpitView.tsx | Two animated vertical bars comparing hours | None |
| `PhaseDots` | CockpitView.tsx | Tiny colored dots showing phase statuses | `phases?` |
| `LivePulse` | CockpitView.tsx | Green pulsing dot with "live" label | None |
| `LiveAuditEntry` | CockpitView.tsx | Animated audit trail row with severity styling | `entry, index, isNew?` |
| `PhasePipeline` | ArcView.tsx | 3-node pipeline with animated connectors | `activePhase, onSelect` |
| `Toggle` | ArcView.tsx | Animated toggle switch | `checked, onChange` |
| `FailActionSelect` | ArcView.tsx | Custom dropdown for Block/Warn/Escalate | `value, onChange` |
| `ProgressBar` | PlatformInspector.tsx | Animated progress bar with color thresholds | `value, max, color, showLabel?` |
| `EngineTab` | PlatformInspector.tsx | Engine selection + LLM routing table | `blueprint?, editMode?` |
| `WiringTab` | PlatformInspector.tsx | Agent connections + MCP status | `blueprint?, editMode?` |

---

## 5. DATA MODEL

### Core Types (`store.ts`)

| Type | Fields | Used By |
|------|--------|---------|
| `View` | `"hero" \| "board" \| "blueprint" \| "session" \| "tollgate" \| "arc" \| "cockpit"` | `AppState.currentView`, Navigation |
| `GovernanceMode` | `"advisory" \| "enforced"` | `AppState.governanceMode`, TollgateResult |
| `StoryType` | `"feature" \| "bug" \| "spike" \| "epic"` | `JiraStory.type` |
| `StoryPriority` | `"critical" \| "high" \| "medium" \| "low"` | `JiraStory.priority` |
| `StoryStatus` | `"backlog" \| "ready" \| "in_symphony" \| "done"` | `JiraStory.status`, BoardView columns |
| `PhaseId` | `"plan" \| "design" \| "build" \| "deploy"` | BlueprintPhase, PhaseState |
| `PhaseStatus` | `"pending" \| "active" \| "passed" \| "failed" \| "skipped"` | PhaseState.status |
| `HumanMode` | `"collaborative" \| "review" \| "delegated"` | BlueprintPhase, PhaseState |

| Interface | Fields | Used By |
|-----------|--------|---------|
| `JiraStory` | `id, key, title, description, type, priority, status, assignee?, component, epicKey?, storyPoints?, labels[], blueprint?, phases?, startedAt?, completedAt?` | BoardView, BlueprintView, SessionView, CockpitView |
| `BlueprintPhase` | `id, name, roles[], tools[], humanMode, estimatedMinutes, estimatedCost` | BlueprintView (PhaseCard), AdjustPanel |
| `Blueprint` | `storyId, reasoning, phases[], totalEstimatedCost, totalEstimatedMinutes, historicalComparison{avgDevHours, avgCost, similarStories[]}, approved, approvedBy?, approvedAt?` | BlueprintView, PlatformInspector |
| `PhaseState` | `id, name, status, roles[], humanMode, startedAt?, completedAt?, costActual?, durationActual?, artifacts[], tollgate?` | SessionView, TollgateView, CockpitView |
| `Artifact` | `name, type, fromRole, preview?` | SessionView (ArtifactCard), TollgateView (HandoverManifest) |
| `TollgateCriterion` | `name, description, score, passed, details?` | TollgateView (CriterionCard) |
| `TollgateResult` | `phaseId, overallScore, passed, mode, criteria[], evaluatedAt, override?{by, justification, at}` | TollgateView, CockpitView |
| `SessionMessage` | `id, role, roleIcon, roleColor, content, timestamp, artifacts?, referencesRole?` | SessionView (ChatMessage) |
| `SessionLogEntry` | `id, timestamp, action, role?, tool?, details?` | SessionView (LogEntry) |
| `AppState` | `currentView, governanceMode, stories[], activeStoryId, activePhaseId, activeTollgate` | All views via `useApp()` |

### Role Types (`roles.ts`)

| Interface | Fields | Used By |
|-----------|--------|---------|
| `RoleCard` | `role_id, display_name, tagline, category, icon, tier, stage_order, stage_name, capabilities{skills[], agents[], commands[]}, verticals[], receives_from[], delivers_to[]` | ROLES array (5 core roles), PlatformInspector |

### Constants (`roles.ts`)

| Constant | Content |
|----------|---------|
| `ROLES` | 5 role definitions: Requirements Dev, Process Leader, Data Steward, Agent Engineer, Agent Ops |
| `VERTICALS` | 5 verticals: Real Estate, Healthcare, Financial Services, Lending, Public Transit |
| `ENGINES` | 3 engine options: CrewAI, LangGraph, AutoGen (each with pros/cons) |

### Sample Data (`sample-data.ts`)

| Export | Content |
|--------|---------|
| `SAMPLE_STORIES` | 8 Jira stories (s1-s8). s6 and s7 have pre-built phases. s8 is fully complete (done). |
| `RBAC_PLAN_MESSAGES` | 6 pre-built chat messages for s6 Plan phase |
| `RBAC_BUILD_MESSAGES` | 6 pre-built chat messages for s6 Build phase |
| `RBAC_DEPLOY_MESSAGES` | 4 pre-built chat messages for s6 Deploy phase |
| `RBAC_PLAN_LOG` | 10 activity log entries for s6 Plan phase |
| `RBAC_BUILD_LOG` | 10 activity log entries for s6 Build phase |
| `RBAC_DEPLOY_LOG` | 8 activity log entries for s6 Deploy phase |
| `ROLE_CATALOG` | 8 role display entries with icons and descriptions |
| `COCKPIT_METRICS` | Sprint, ROI, quality, cost breakdown, and audit trail data |
| `generateBlueprint()` | Function: deterministic blueprint generation based on story type/component |
| `generateSessionMessages()` | Function: context-aware message generation for any story/phase |
| `generateAgentReply()` | Function: keyword-matching reply generation for user chat input |

---

## 6. CONFIGURATION SURFACES

### 6.1 Platform Inspector (5 tabs)

**Location**: Slide-out panel from right edge, triggered by "Platform" button in nav.

| Tab | Editable Fields (Edit Mode) | Persistence |
|-----|---------------------------|-------------|
| Engine & LLM | Engine dropdown (3 options), LLM model dropdown per role (12 options) | Local state only |
| Agent Wiring | Add/remove connections, change from/to/protocol/direction | Local state only |
| Guardrails | None (read-only display) | N/A |
| Context Flow | None (read-only display) | N/A |
| Knowledge | None (read-only display) | N/A |

**Edit Mode Toggle**: Button in panel header enables edit controls.

### 6.2 Arc Configuration (ArcView)

**Location**: Full view, accessed via "Arc" button in nav.

| Config Area | Editable Fields | Persistence |
|-------------|----------------|-------------|
| Phase selection | 3 clickable phase nodes | Local state |
| Governance mode per phase | Enforced/Advisory toggle | Local state |
| Pass threshold per phase | Range slider 0-100 | Local state |
| Tollgate criteria per phase | Enable toggle, weight dropdown (1-3), fail action dropdown (Block/Warn/Escalate) | Local state |
| Add criterion | "+" button adds new row | Local state |
| Governance rules (global) | 7 toggle switches | Local state |
| Industry presets | 4 clickable cards (Default, Healthcare, FinServ, Government) | Local state |
| Save/Reset | Save button (visual confirmation), Reset button (restores defaults) | Local state (not persisted) |

### 6.3 Adjust Panel (BlueprintView)

**Location**: Inline panel within Blueprint view, toggled by "Adjust" button.

| Config Area | Editable Fields | Persistence |
|-------------|----------------|-------------|
| Roles per phase | 8 checkboxes per phase column | Local state (defaultValue) |
| LLM model per role | Dropdown (3 Claude options) | Local state (defaultValue) |
| Human mode per phase | Radio buttons (Collaborative/Review/Delegated) | Local state (defaultValue) |
| Budget cap per phase | Number input | Local state (defaultValue) |
| Save/Cancel | Save shows "Saved!" then closes | Local state (not persisted) |

### 6.4 Governance Mode Toggle

**Location**: Top navigation bar (right side).

| Element | Values | Persistence |
|---------|--------|-------------|
| Enforced/Advisory segmented button | `"enforced"` or `"advisory"` | Global store (`SET_GOVERNANCE`) — persists for session |

### 6.5 Theme Toggle

**Location**: Top navigation bar (right side).

| Element | Values | Persistence |
|---------|--------|-------------|
| Sun/Moon icon button | `"dark"` or `"light"` | Local `page.tsx` state. Sets `data-theme` attribute on `<body>`. |

---

## 7. SIMULATED vs REAL

| Feature | Status | Details |
|---------|--------|---------|
| **Story data** | Simulated | 8 hardcoded stories in `SAMPLE_STORIES` |
| **Blueprint generation** | Simulated | Deterministic algorithm in `generateBlueprint()` using story type/component |
| **Pull into Symphony** | Simulated | 3-second `setTimeout` with animated steps |
| **Provisioning animation** | Simulated | 10-second timed sequence (850ms per step) |
| **Agent chat messages** | Simulated | Pre-built arrays for s6; generated templates for other stories via `generateSessionMessages()` |
| **Agent typing indicator** | Simulated | Timed message reveal with cycling activities from `AGENT_ACTIVITIES` |
| **Agent chat replies** | Simulated | Keyword matching on user input via `generateAgentReply()` |
| **Tollgate evaluation** | Simulated | Hardcoded criteria templates in `COMPLETE_PHASE` reducer |
| **Tollgate override** | Interactive but local | Stores override in component state + dispatches to global store |
| **Tollgate re-run** | Simulated | 2-second `setTimeout`, passes if override applied, fails otherwise |
| **Cockpit ROI metrics** | Simulated | Hardcoded `COCKPIT_METRICS` object |
| **Live token counter** | Simulated | `setInterval(2500)` with random increments, capped |
| **Live audit trail** | Simulated | `setInterval(4000)` injecting hardcoded entries, capped at 10 |
| **Quality trend sparkline** | Simulated | Mix of hardcoded historical + actual tollgate scores |
| **Sprint story counts** | Interactive but local | Computed from actual `state.stories` status values |
| **Platform Inspector data** | Simulated | All from hardcoded constants (`ENGINE_CONFIG`, `AGENT_WIRING`, etc.) |
| **Platform Inspector edit** | Interactive but local | Changes stored in component state, not persisted |
| **Arc Configuration** | Interactive but local | All criteria/rules in local state, "Save" is visual only |
| **Adjust Panel** | Interactive but local | Uses `defaultValue` inputs, "Save" closes panel |
| **Governance mode toggle** | Interactive but local | Persists in global store for session; affects tollgate mode display |
| **Theme toggle** | Interactive but local | Persists for session via `data-theme` attribute |
| **Navigation** | Interactive but local | All view switching via in-memory `SET_VIEW` dispatch |
| **Pitch page** | Simulated | Entirely static content |
| **MCP connections** | Simulated | Hardcoded status in `MCP_CONNECTIONS` |
| **Knowledge Layer** | Simulated | Hardcoded patterns and feedback in `KNOWLEDGE` |
| **Cost breakdown** | Simulated | Hardcoded per-role costs in `COCKPIT_METRICS` |
| **Security findings (CVE)** | Simulated | Hardcoded for story s7's build phase tollgate |
| **Handover manifests** | Simulated | Hardcoded decisions and risks per phase ID |
| **Backend API** | None | No API calls anywhere. Zero network requests for data. |
| **Authentication** | None | No login, no session management |
| **Data persistence** | None | All state lost on page refresh |

---

**Summary**: The Kestrel Symphony UI is a fully self-contained interactive prototype. All data is hardcoded or deterministically generated. The UI demonstrates complete workflow coverage from story intake through governed deployment with rich configuration surfaces, but no feature connects to a real backend. Every interactive element works within the in-memory state model for the duration of a browser session.
