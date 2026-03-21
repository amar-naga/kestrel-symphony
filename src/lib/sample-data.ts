import type {
  JiraStory,
  Blueprint,
  PhaseState,
  TollgateResult,
  SessionMessage,
  SessionLogEntry,
} from "./store";

/* ================================================================
   JIRA STORIES — "NextGen Customer Portal" project
   ================================================================ */

export const SAMPLE_STORIES: JiraStory[] = [
  {
    id: "s1",
    key: "NCP-1247",
    title: "Add SSO authentication via OAuth 2.0",
    description:
      "Implement single sign-on using OAuth 2.0 / OIDC for enterprise tier customers. Must support Azure AD, Okta, and Google Workspace providers. Session management must respect tenant-level timeout policies.",
    type: "feature",
    priority: "high",
    status: "ready",
    assignee: "Sarah Chen",
    component: "auth",
    epicKey: "NCP-1200",
    storyPoints: 8,
    labels: ["security", "enterprise", "sso"],
  },
  {
    id: "s2",
    key: "NCP-1248",
    title: "Fix session timeout not respecting timezone",
    description:
      "Users in IST timezone report sessions expiring at incorrect times. The timeout calculation uses server UTC without converting to the user's configured timezone. Affects all enterprise tier accounts.",
    type: "bug",
    priority: "critical",
    status: "ready",
    assignee: "Marcus Johnson",
    component: "auth",
    storyPoints: 3,
    labels: ["bug", "timezone", "urgent"],
  },
  {
    id: "s3",
    key: "NCP-1249",
    title: "Design new dashboard layout for enterprise tier",
    description:
      "Redesign the main dashboard to support enterprise-specific widgets: team activity feed, compliance status, usage analytics. Must maintain backward compatibility with existing pro-tier layout.",
    type: "feature",
    priority: "medium",
    status: "backlog",
    component: "dashboard",
    epicKey: "NCP-1200",
    storyPoints: 13,
    labels: ["design", "enterprise", "dashboard"],
  },
  {
    id: "s4",
    key: "NCP-1250",
    title: "Migrate user preferences to new schema",
    description:
      "Move user preferences from the legacy JSON blob column to a normalized preferences table. Must handle 240K existing user records with zero downtime. Include rollback procedure.",
    type: "feature",
    priority: "high",
    status: "ready",
    assignee: "Priya Patel",
    component: "data",
    storyPoints: 8,
    labels: ["migration", "database", "zero-downtime"],
  },
  {
    id: "s5",
    key: "NCP-1251",
    title: "Investigate GraphQL vs REST for mobile API",
    description:
      "Spike: evaluate whether the mobile app should use GraphQL or REST for the v2 API. Consider bandwidth constraints, caching strategies, and team expertise. Produce recommendation document.",
    type: "spike",
    priority: "low",
    status: "backlog",
    component: "api",
    storyPoints: 3,
    labels: ["spike", "mobile", "api"],
  },
  {
    id: "s6",
    key: "NCP-1252",
    title: "Add RBAC permissions for admin panel",
    description:
      "Implement role-based access control for the admin panel. Support roles: Super Admin, Account Manager, Support Agent, Viewer. Each role has different page-level and action-level permissions.",
    type: "feature",
    priority: "high",
    status: "in_symphony",
    assignee: "David Kim",
    component: "auth",
    epicKey: "NCP-1200",
    storyPoints: 8,
    labels: ["security", "rbac", "admin"],
    startedAt: "2026-03-21T08:15:00Z",
    phases: [
      {
        id: "plan",
        name: "Plan",
        status: "passed",
        roles: ["Requirements Dev", "Process Leader"],
        humanMode: "collaborative",
        startedAt: "2026-03-21T08:15:00Z",
        completedAt: "2026-03-21T08:42:00Z",
        artifacts: [
          { name: "RBAC Requirements Spec", type: "spec", fromRole: "Requirements Dev", preview: "4 roles defined with 12 permission groups across 8 admin pages..." },
          { name: "Approval Gate Definition", type: "doc", fromRole: "Process Leader", preview: "Permission changes require Super Admin approval. Audit log required for all RBAC modifications..." },
        ],
        tollgate: {
          phaseId: "plan",
          overallScore: 96,
          passed: true,
          mode: "enforced",
          criteria: [
            { name: "Requirements completeness", description: "All user stories have acceptance criteria", score: 98, passed: true },
            { name: "Stakeholder sign-off", description: "Product owner has reviewed scope", score: 95, passed: true },
            { name: "Security review", description: "Security implications documented", score: 94, passed: true },
          ],
          evaluatedAt: "2026-03-21T08:42:00Z",
        },
      },
      {
        id: "build",
        name: "Build",
        status: "active",
        roles: ["Agent Engineer", "Code Auditor"],
        humanMode: "review",
        startedAt: "2026-03-21T08:45:00Z",
        artifacts: [
          { name: "rbac-middleware.ts", type: "code", fromRole: "Agent Engineer", preview: "export function checkPermission(role: Role, resource: string, action: Action): boolean { ... }" },
          { name: "rbac.test.ts", type: "test", fromRole: "Agent Engineer", preview: "describe('RBAC Middleware', () => { it('should deny viewer from creating users', ...) })" },
        ],
      },
      {
        id: "deploy",
        name: "Deploy",
        status: "pending",
        roles: ["Agent Ops"],
        humanMode: "delegated",
        artifacts: [],
      },
    ],
    blueprint: {
      storyId: "s6",
      reasoning:
        "RBAC stories require Plan + Build + Deploy. The auth module has had 3 tollgate failures in the last 8 stories — recommending security-focused Code Auditor role. Similar stories NCP-1089 and NCP-1134 averaged 14 dev-hours with vendor team.",
      phases: [
        { id: "plan", name: "Plan", roles: ["Requirements Dev", "Process Leader"], tools: ["Jira", "Confluence"], humanMode: "collaborative", estimatedMinutes: 30, estimatedCost: 2.80 },
        { id: "build", name: "Build", roles: ["Agent Engineer", "Code Auditor"], tools: ["Claude Code", "GitHub"], humanMode: "review", estimatedMinutes: 45, estimatedCost: 4.20 },
        { id: "deploy", name: "Deploy", roles: ["Agent Ops"], tools: ["GitHub Actions", "Vercel", "CloudWatch"], humanMode: "delegated", estimatedMinutes: 15, estimatedCost: 1.40 },
      ],
      totalEstimatedCost: 8.40,
      totalEstimatedMinutes: 90,
      historicalComparison: { avgDevHours: 14, avgCost: 2800, similarStories: ["NCP-1089", "NCP-1134"] },
      approved: true,
    },
  },
  {
    id: "s7",
    key: "NCP-1253",
    title: "Performance regression on search endpoint",
    description:
      "Search API response time increased from 120ms to 890ms after the last deployment. Likely caused by the new full-text index on the descriptions column. P95 latency is now above SLA threshold.",
    type: "bug",
    priority: "critical",
    status: "in_symphony",
    assignee: "Alex Rivera",
    component: "search",
    storyPoints: 5,
    labels: ["performance", "regression", "p0"],
    startedAt: "2026-03-21T09:00:00Z",
    phases: [
      {
        id: "build",
        name: "Build",
        status: "failed",
        roles: ["Agent Engineer", "Code Auditor"],
        humanMode: "review",
        startedAt: "2026-03-21T09:00:00Z",
        completedAt: "2026-03-21T09:28:00Z",
        artifacts: [
          { name: "search-index-fix.sql", type: "code", fromRole: "Agent Engineer", preview: "CREATE INDEX CONCURRENTLY idx_search_descriptions_gin ON products USING gin(to_tsvector('english', description));" },
          { name: "perf-benchmark.ts", type: "test", fromRole: "Agent Engineer", preview: "P95 latency: 890ms → 145ms after index optimization. 6.1x improvement." },
        ],
        tollgate: {
          phaseId: "build",
          overallScore: 62,
          passed: false,
          mode: "enforced",
          criteria: [
            { name: "Tests passing", description: "All unit and integration tests pass", score: 100, passed: true },
            { name: "Performance benchmark", description: "P95 latency within SLA", score: 95, passed: true },
            { name: "Security scan", description: "No critical or high vulnerabilities", score: 42, passed: false, details: "CVE-2026-3891: SQL injection vector in dynamic search query construction. The search input is interpolated directly into the query string without parameterization." },
            { name: "Code review", description: "Peer review approved", score: 88, passed: true },
          ],
          evaluatedAt: "2026-03-21T09:28:00Z",
        },
      },
      {
        id: "deploy",
        name: "Deploy",
        status: "pending",
        roles: ["Agent Ops"],
        humanMode: "delegated",
        artifacts: [],
      },
    ],
    blueprint: {
      storyId: "s7",
      reasoning:
        "Bug fix — skipping Plan and Design phases. Direct to Build + Deploy. The search module's last 2 deployments both triggered performance alerts. Adding Code Auditor for security review given the query construction changes.",
      phases: [
        { id: "build", name: "Build", roles: ["Agent Engineer", "Code Auditor"], tools: ["Claude Code", "GitHub", "pgBench"], humanMode: "review", estimatedMinutes: 30, estimatedCost: 3.60 },
        { id: "deploy", name: "Deploy", roles: ["Agent Ops"], tools: ["GitHub Actions", "AWS", "CloudWatch"], humanMode: "delegated", estimatedMinutes: 10, estimatedCost: 0.80 },
      ],
      totalEstimatedCost: 4.40,
      totalEstimatedMinutes: 40,
      historicalComparison: { avgDevHours: 6, avgCost: 1200, similarStories: ["NCP-1198", "NCP-1221"] },
      approved: true,
    },
  },
];

/* ================================================================
   BLUEPRINT TEMPLATES — for new stories being pulled in
   ================================================================ */

export function generateBlueprint(story: JiraStory): Blueprint {
  const isFeature = story.type === "feature";
  const isBug = story.type === "bug";
  const isSpike = story.type === "spike";

  if (isSpike) {
    return {
      storyId: story.id,
      reasoning: `Spike/research ticket — Plan phase only. No build or deployment required. The ${story.component} module has had ${Math.floor(Math.random() * 3) + 1} architecture discussions in the last sprint. Recommending Requirements Dev to structure the investigation.`,
      phases: [
        { id: "plan", name: "Plan", roles: ["Requirements Dev"], tools: ["Jira", "Confluence", "Notion"], humanMode: "collaborative", estimatedMinutes: 45, estimatedCost: 3.20 },
      ],
      totalEstimatedCost: 3.20,
      totalEstimatedMinutes: 45,
      historicalComparison: { avgDevHours: 8, avgCost: 1600, similarStories: ["NCP-1102"] },
      approved: false,
    };
  }

  if (isBug) {
    return {
      storyId: story.id,
      reasoning: `Bug fix on the ${story.component} module — skipping Plan and Design. Direct to Build + Deploy. ${story.priority === "critical" ? "Critical priority — fast-tracking with Code Auditor for safety." : "Standard bug flow with automated testing."}`,
      phases: [
        { id: "build", name: "Build", roles: ["Agent Engineer", "Code Auditor"], tools: ["Claude Code", "GitHub"], humanMode: "review", estimatedMinutes: 25, estimatedCost: 3.10 },
        { id: "deploy", name: "Deploy", roles: ["Agent Ops"], tools: ["GitHub Actions", "Vercel"], humanMode: "delegated", estimatedMinutes: 10, estimatedCost: 0.80 },
      ],
      totalEstimatedCost: 3.90,
      totalEstimatedMinutes: 35,
      historicalComparison: { avgDevHours: 4, avgCost: 800, similarStories: ["NCP-1201"] },
      approved: false,
    };
  }

  // Feature — full pipeline
  const hasAuthComponent = story.component === "auth";
  return {
    storyId: story.id,
    reasoning: `Feature story requiring full Plan → Build → Deploy pipeline. The ${story.component} module ${hasAuthComponent ? "has had 3 tollgate failures in the last 8 stories — adding security-focused Code Auditor role. " : "has been stable — standard role composition. "}Similar stories ${story.labels.includes("enterprise") ? "(enterprise tier)" : ""} averaged ${Math.floor(Math.random() * 6) + 10} dev-hours with vendor team.`,
    phases: [
      { id: "plan", name: "Plan", roles: ["Requirements Dev", "Process Leader"], tools: ["Jira", "Confluence"], humanMode: "collaborative", estimatedMinutes: 30, estimatedCost: 2.80 },
      { id: "build", name: "Build", roles: ["Agent Engineer", hasAuthComponent ? "Code Auditor" : "Data Steward"], tools: ["Claude Code", "GitHub", "Supabase"], humanMode: "review", estimatedMinutes: 45, estimatedCost: 4.20 },
      { id: "deploy", name: "Deploy", roles: ["Agent Ops"], tools: ["GitHub Actions", "Vercel", "CloudWatch"], humanMode: "delegated", estimatedMinutes: 15, estimatedCost: 1.40 },
    ],
    totalEstimatedCost: 8.40,
    totalEstimatedMinutes: 90,
    historicalComparison: { avgDevHours: 12, avgCost: 2400, similarStories: ["NCP-1089", "NCP-1134"] },
    approved: false,
  };
}

/* ================================================================
   SESSION DATA — pre-built messages for NCP-1252 Build phase
   ================================================================ */

export const RBAC_BUILD_MESSAGES: SessionMessage[] = [
  {
    id: "m1",
    role: "Agent Engineer",
    roleIcon: "Cpu",
    roleColor: "#4361ee",
    content: "Analyzing the RBAC requirements spec from Plan phase. I see 4 roles (Super Admin, Account Manager, Support Agent, Viewer) with 12 permission groups across 8 admin pages. Starting with the middleware layer.",
    timestamp: "2026-03-21T08:45:12Z",
    artifacts: ["rbac-requirements-spec.md"],
  },
  {
    id: "m2",
    role: "Code Auditor",
    roleIcon: "ShieldCheck",
    roleColor: "#e63946",
    content: "I'll review the permission model as Agent Engineer builds it. Flagging from the Plan spec: the Process Leader noted that permission changes require Super Admin approval with audit logging. I'll verify that's enforced in the implementation.",
    timestamp: "2026-03-21T08:45:45Z",
    referencesRole: "Process Leader",
  },
  {
    id: "m3",
    role: "Agent Engineer",
    roleIcon: "Cpu",
    roleColor: "#4361ee",
    content: "Created the permission middleware. Using a hierarchical model — Super Admin inherits all permissions, Account Manager inherits Support Agent permissions, etc. Connected to GitHub via MCP — pushing to feature/ncp-1252-rbac branch.",
    timestamp: "2026-03-21T08:52:30Z",
    artifacts: ["rbac-middleware.ts"],
  },
  {
    id: "m4",
    role: "Code Auditor",
    roleIcon: "ShieldCheck",
    roleColor: "#e63946",
    content: "Reviewing rbac-middleware.ts. The hierarchy model is clean, but I found an issue: the permission check doesn't validate the user's tenant scope. A Super Admin in Tenant A could technically modify Tenant B's users. Adding tenant isolation to my review notes.",
    timestamp: "2026-03-21T08:56:18Z",
    referencesRole: "Agent Engineer",
  },
  {
    id: "m5",
    role: "Agent Engineer",
    roleIcon: "Cpu",
    roleColor: "#4361ee",
    content: "Good catch. Adding tenant_id scoping to every permission check. Updated the middleware to include `AND tenant_id = $currentTenant` in all authorization queries. Also added 47 unit tests covering all role × resource × action combinations.",
    timestamp: "2026-03-21T09:04:42Z",
    artifacts: ["rbac-middleware.ts", "rbac.test.ts"],
  },
  {
    id: "m6",
    role: "Code Auditor",
    roleIcon: "ShieldCheck",
    roleColor: "#e63946",
    content: "Tenant scoping confirmed. All 47 tests passing. Running security scan now... No vulnerabilities detected. The audit logging requirement from the Plan phase is properly implemented — every permission change writes to the audit_events table with actor, action, and timestamp. Ready for tollgate.",
    timestamp: "2026-03-21T09:12:55Z",
  },
];

export const RBAC_BUILD_LOG: SessionLogEntry[] = [
  { id: "l1", timestamp: "2026-03-21T08:45:00Z", action: "Phase started", role: "Symphony", details: "Build phase initiated for NCP-1252" },
  { id: "l2", timestamp: "2026-03-21T08:45:05Z", action: "Role joined", role: "Agent Engineer", details: "Connected to Claude Code via MCP" },
  { id: "l3", timestamp: "2026-03-21T08:45:08Z", action: "Role joined", role: "Code Auditor", details: "Security review mode activated" },
  { id: "l4", timestamp: "2026-03-21T08:45:12Z", action: "Artifact received", role: "Agent Engineer", tool: "Confluence MCP", details: "Loaded RBAC Requirements Spec from Plan phase" },
  { id: "l5", timestamp: "2026-03-21T08:45:45Z", action: "Cross-reference", role: "Code Auditor", details: "Referencing Process Leader's approval gate definition" },
  { id: "l6", timestamp: "2026-03-21T08:52:30Z", action: "Code pushed", role: "Agent Engineer", tool: "GitHub MCP", details: "rbac-middleware.ts → feature/ncp-1252-rbac" },
  { id: "l7", timestamp: "2026-03-21T08:56:18Z", action: "Security finding", role: "Code Auditor", details: "Tenant isolation gap detected in permission check" },
  { id: "l8", timestamp: "2026-03-21T09:04:42Z", action: "Code updated", role: "Agent Engineer", tool: "GitHub MCP", details: "Added tenant scoping + 47 unit tests" },
  { id: "l9", timestamp: "2026-03-21T09:12:55Z", action: "Security scan", role: "Code Auditor", tool: "Snyk MCP", details: "0 vulnerabilities detected" },
  { id: "l10", timestamp: "2026-03-21T09:13:00Z", action: "Phase ready", role: "Symphony", details: "Build phase complete — triggering tollgate evaluation" },
];

/* ================================================================
   ROLES CATALOG (for display)
   ================================================================ */

export const ROLE_CATALOG = [
  { id: "Requirements Dev", icon: "FileText", color: "#4361ee", description: "Translates business needs into structured specs" },
  { id: "Process Leader", icon: "ClipboardCheck", color: "#7b2ff7", description: "Builds SOPs, edge cases, and approval gates" },
  { id: "Data Steward", icon: "Database", color: "#00c896", description: "Validates data schemas and quality constraints" },
  { id: "Agent Engineer", icon: "Cpu", color: "#4361ee", description: "Builds, tests, and validates implementations" },
  { id: "Code Auditor", icon: "ShieldCheck", color: "#e63946", description: "Security scanning and code quality review" },
  { id: "UX Designer", icon: "Palette", color: "#f59e0b", description: "Interface design and usability validation" },
  { id: "Architect", icon: "Network", color: "#06b6d4", description: "Technical architecture and system design" },
  { id: "Agent Ops", icon: "Activity", color: "#00c896", description: "Deploys, monitors, and manages production" },
] as const;

/* ================================================================
   COCKPIT METRICS
   ================================================================ */

export const COCKPIT_METRICS = {
  sprint: {
    name: "Sprint 14",
    startDate: "2026-03-10",
    endDate: "2026-03-24",
    storiesTotal: 14,
    storiesCompleted: 9,
    storiesInSymphony: 2,
    storiesRemaining: 3,
  },
  roi: {
    symphonyHours: 23,
    symphonyCost: 67.20,
    traditionalHours: 280,
    traditionalCost: 42000,
    timeSavedPercent: 92,
    costSavedPercent: 99.8,
  },
  quality: {
    avgTollgateScore: 91.4,
    tollgatePassRate: 85,
    securityIssuesCaught: 7,
    overrides: 1,
  },
  costBreakdown: [
    { role: "Agent Engineer", cost: 28.40, tokens: 142000, stories: 11 },
    { role: "Requirements Dev", cost: 14.20, tokens: 71000, stories: 9 },
    { role: "Code Auditor", cost: 11.80, tokens: 59000, stories: 7 },
    { role: "Agent Ops", cost: 7.60, tokens: 38000, stories: 9 },
    { role: "Process Leader", cost: 5.20, tokens: 26000, stories: 6 },
  ],
  auditTrail: [
    { time: "09:28", event: "Tollgate BLOCKED", story: "NCP-1253", detail: "Security scan failed — CVE-2026-3891", severity: "critical" },
    { time: "09:13", event: "Phase completed", story: "NCP-1252", detail: "Build phase passed tollgate (96/100)", severity: "info" },
    { time: "08:42", event: "Tollgate passed", story: "NCP-1252", detail: "Plan phase — requirements complete", severity: "success" },
    { time: "08:15", event: "Story pulled", story: "NCP-1252", detail: "Blueprint approved — 3 phases, est. $8.40", severity: "info" },
    { time: "08:02", event: "Sprint started", story: "—", detail: "Sprint 14 — 14 stories, 3 in Symphony", severity: "info" },
  ],
};
