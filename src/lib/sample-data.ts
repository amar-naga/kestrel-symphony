import type {
  JiraStory,
  Blueprint,
  PhaseState,
  PhaseId,
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
        costActual: 2.80,
        durationActual: 27,
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
        "RBAC stories require Plan + Build + Deploy. The auth module has had 3 tollgate failures in the last 8 stories — recommending security-focused Code Auditor role. Similar stories NCP-1089 and NCP-1134 averaged 14 dev-hours with the dev team.",
      phases: [
        { id: "plan", name: "Plan", roles: ["Requirements Dev", "Process Leader"], tools: ["Jira", "Confluence"], humanMode: "collaborative", estimatedMinutes: 30, estimatedCost: 2.80 },
        { id: "build", name: "Build", roles: ["Agent Engineer", "Code Auditor"], tools: ["Claude Code", "GitHub"], humanMode: "review", estimatedMinutes: 45, estimatedCost: 4.20 },
        { id: "deploy", name: "Deploy", roles: ["Agent Ops"], tools: ["GitHub Actions", "Vercel", "CloudWatch"], humanMode: "delegated", estimatedMinutes: 15, estimatedCost: 1.40 },
      ],
      totalEstimatedCost: 8.40,
      totalEstimatedMinutes: 90,
      historicalComparison: { avgDevHours: 14, avgCost: 2800, similarStories: ["NCP-1089", "NCP-1134"] },
      approved: true,
      approvedBy: "Demo User",
      approvedAt: "2026-03-21T08:15:00Z",
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
        costActual: 3.60,
        durationActual: 28,
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
      approvedBy: "Demo User",
      approvedAt: "2026-03-21T09:00:00Z",
    },
  },
  {
    id: "s8",
    key: "NCP-1254",
    title: "Implement automated email notification system",
    description: "Build email notification pipeline for order confirmations, shipping updates, and delivery receipts. Include template management and delivery tracking.",
    type: "feature",
    priority: "medium",
    status: "done",
    assignee: "Sarah Chen",
    component: "notifications",
    epicKey: "NCP-1200",
    storyPoints: 5,
    labels: ["notifications", "email"],
    startedAt: "2026-03-14T10:00:00Z",
    completedAt: "2026-03-14T14:30:00Z",
    phases: [
      {
        id: "plan",
        name: "Plan",
        status: "passed",
        roles: ["Requirements Dev", "Process Leader"],
        humanMode: "collaborative",
        startedAt: "2026-03-14T10:00:00Z",
        completedAt: "2026-03-14T10:35:00Z",
        costActual: 2.40,
        durationActual: 35,
        artifacts: [
          { name: "Email Notification Spec", type: "spec", fromRole: "Requirements Dev", preview: "3 notification types: order confirmation, shipping update, delivery receipt..." },
          { name: "Template Schema", type: "doc", fromRole: "Process Leader", preview: "Mustache templates with i18n support, preview API, delivery tracking webhook..." },
        ],
        tollgate: {
          phaseId: "plan",
          overallScore: 94,
          passed: true,
          mode: "enforced",
          criteria: [
            { name: "Requirements completeness", description: "All notification types have triggers and templates defined", score: 96, passed: true },
            { name: "Stakeholder sign-off", description: "Product owner approved notification content", score: 92, passed: true },
            { name: "Integration review", description: "Email provider (SendGrid) integration documented", score: 94, passed: true },
          ],
          evaluatedAt: "2026-03-14T10:35:00Z",
        },
      },
      {
        id: "build",
        name: "Build",
        status: "passed",
        roles: ["Agent Engineer", "Code Auditor"],
        humanMode: "review",
        startedAt: "2026-03-14T10:40:00Z",
        completedAt: "2026-03-14T12:15:00Z",
        costActual: 4.80,
        durationActual: 95,
        artifacts: [
          { name: "notification-service.ts", type: "code", fromRole: "Agent Engineer", preview: "export class NotificationService { async sendOrderConfirmation(orderId: string) { ... } }" },
          { name: "notification.test.ts", type: "test", fromRole: "Agent Engineer", preview: "describe('NotificationService', () => { it('sends order confirmation email', ...) })" },
          { name: "email-templates/", type: "doc", fromRole: "Agent Engineer", preview: "3 Mustache templates: order-confirmation.html, shipping-update.html, delivery-receipt.html" },
        ],
        tollgate: {
          phaseId: "build",
          overallScore: 92,
          passed: true,
          mode: "enforced",
          criteria: [
            { name: "Tests passing", description: "All unit and integration tests pass", score: 100, passed: true },
            { name: "Code coverage", description: "Coverage meets 80% threshold", score: 88, passed: true },
            { name: "Security scan", description: "No vulnerabilities in email handling", score: 94, passed: true },
            { name: "Code review", description: "Peer review approved", score: 86, passed: true },
          ],
          evaluatedAt: "2026-03-14T12:15:00Z",
        },
      },
      {
        id: "deploy",
        name: "Deploy",
        status: "passed",
        roles: ["Agent Ops"],
        humanMode: "delegated",
        startedAt: "2026-03-14T12:20:00Z",
        completedAt: "2026-03-14T12:45:00Z",
        costActual: 0.90,
        durationActual: 25,
        artifacts: [
          { name: "deploy-manifest.json", type: "doc", fromRole: "Agent Ops", preview: "Deployed to production via GitHub Actions. SendGrid webhook configured." },
        ],
        tollgate: {
          phaseId: "deploy",
          overallScore: 97,
          passed: true,
          mode: "enforced",
          criteria: [
            { name: "Staging validation", description: "All notification types tested in staging", score: 98, passed: true },
            { name: "Rollback plan", description: "Rollback procedure documented", score: 95, passed: true },
            { name: "Monitoring", description: "SendGrid delivery metrics dashboard configured", score: 98, passed: true },
          ],
          evaluatedAt: "2026-03-14T12:45:00Z",
        },
      },
    ],
    blueprint: {
      storyId: "s8",
      reasoning: "Standard notification feature — Plan + Build + Deploy pipeline. The notifications module has been stable with no recent tollgate failures. Using standard role composition.",
      phases: [
        { id: "plan", name: "Plan", roles: ["Requirements Dev", "Process Leader"], tools: ["Jira", "Confluence"], humanMode: "collaborative", estimatedMinutes: 30, estimatedCost: 2.80 },
        { id: "build", name: "Build", roles: ["Agent Engineer", "Code Auditor"], tools: ["Claude Code", "GitHub", "SendGrid"], humanMode: "review", estimatedMinutes: 90, estimatedCost: 5.20 },
        { id: "deploy", name: "Deploy", roles: ["Agent Ops"], tools: ["GitHub Actions", "Vercel", "CloudWatch"], humanMode: "delegated", estimatedMinutes: 20, estimatedCost: 1.00 },
      ],
      totalEstimatedCost: 9.00,
      totalEstimatedMinutes: 140,
      historicalComparison: { avgDevHours: 10, avgCost: 2000, similarStories: ["NCP-1178", "NCP-1201"] },
      approved: true,
      approvedBy: "Demo User",
      approvedAt: "2026-03-14T10:00:00Z",
    },
  },
];

/* ================================================================
   BLUEPRINT TEMPLATES — for new stories being pulled in
   ================================================================ */

/**
 * Simple deterministic hash from a string to a number.
 * Used to produce stable "random-looking" values from story properties.
 */
function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return Math.abs(hash);
}

export function generateBlueprint(story: JiraStory): Blueprint {
  const isFeature = story.type === "feature";
  const isBug = story.type === "bug";
  const isSpike = story.type === "spike";

  const hash = stableHash(story.id + story.component);

  if (isSpike) {
    const archDiscussions = (hash % 3) + 1; // 1-3, deterministic
    return {
      storyId: story.id,
      reasoning: `Spike/research ticket — Plan phase only. No build or deployment required. The ${story.component} module has had ${archDiscussions} architecture discussions in the last sprint. Recommending Requirements Dev to structure the investigation.`,
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
  const avgDevHours = 10 + (hash % 6); // 10-15, deterministic per story
  return {
    storyId: story.id,
    reasoning: `Feature story requiring full Plan → Build → Deploy pipeline. The ${story.component} module ${hasAuthComponent ? "has had 3 tollgate failures in the last 8 stories — adding security-focused Code Auditor role. " : "has been stable — standard role composition. "}Similar stories ${story.labels.includes("enterprise") ? "(enterprise tier)" : ""} averaged ${avgDevHours} dev-hours with the dev team.`,
    phases: [
      { id: "plan", name: "Plan", roles: ["Requirements Dev", "Process Leader"], tools: ["Jira", "Confluence"], humanMode: "collaborative", estimatedMinutes: 30, estimatedCost: 2.80 },
      { id: "build", name: "Build", roles: ["Agent Engineer", hasAuthComponent ? "Code Auditor" : "Data Steward"], tools: ["Claude Code", "GitHub", "Supabase"], humanMode: "review", estimatedMinutes: 45, estimatedCost: 4.20 },
      { id: "deploy", name: "Deploy", roles: ["Agent Ops"], tools: ["GitHub Actions", "Vercel", "CloudWatch"], humanMode: "delegated", estimatedMinutes: 15, estimatedCost: 1.40 },
    ],
    totalEstimatedCost: 8.40,
    totalEstimatedMinutes: 90,
    historicalComparison: { avgDevHours, avgCost: 2400, similarStories: ["NCP-1089", "NCP-1134"] },
    approved: false,
  };
}

/* ================================================================
   SESSION DATA — pre-built messages for NCP-1252 Plan phase
   ================================================================ */

export const RBAC_PLAN_MESSAGES: SessionMessage[] = [
  {
    id: "pm1",
    role: "Requirements Dev",
    roleIcon: "FileText",
    roleColor: "#FF6B2C",
    content: "Starting requirements analysis for RBAC admin panel. Pulling context from NCP-1200 epic and reviewing the existing auth module. We need 4 roles: Super Admin, Account Manager, Support Agent, and Viewer.",
    timestamp: "2026-03-21T08:16:20Z",
    artifacts: ["ncp-1200-epic-context.md"],
  },
  {
    id: "pm2",
    role: "Process Leader",
    roleIcon: "ClipboardCheck",
    roleColor: "#8B8B8B",
    content: "I'll define the approval gates and edge cases while you structure the requirements. Key question: should permission changes require Super Admin approval, or can Account Managers self-serve? Based on SOC 2 compliance, I'm recommending Super Admin approval with audit logging.",
    timestamp: "2026-03-21T08:19:45Z",
  },
  {
    id: "pm3",
    role: "Requirements Dev",
    roleIcon: "FileText",
    roleColor: "#FF6B2C",
    content: "Agreed on Super Admin approval. I've mapped out 12 permission groups across 8 admin pages. Each role gets a specific permission matrix. Documenting the hierarchy: Super Admin > Account Manager > Support Agent > Viewer.",
    timestamp: "2026-03-21T08:25:10Z",
    artifacts: ["rbac-requirements-spec.md"],
  },
  {
    id: "pm4",
    role: "Process Leader",
    roleIcon: "ClipboardCheck",
    roleColor: "#8B8B8B",
    content: "Reviewing the permission matrix now. Edge case identified: what happens when an Account Manager is downgraded to Support Agent while they have active sessions? Recommending immediate session invalidation with a grace notification. Adding this to acceptance criteria.",
    timestamp: "2026-03-21T08:30:22Z",
    referencesRole: "Requirements Dev",
  },
  {
    id: "pm5",
    role: "Requirements Dev",
    roleIcon: "FileText",
    roleColor: "#FF6B2C",
    content: "Good edge case. Updated the spec to include role transition handling. All acceptance criteria now have explicit pass/fail conditions. The spec covers: role hierarchy, permission inheritance, audit logging, role transitions, and tenant isolation requirements.",
    timestamp: "2026-03-21T08:36:40Z",
    artifacts: ["rbac-requirements-spec.md"],
  },
  {
    id: "pm6",
    role: "Process Leader",
    roleIcon: "ClipboardCheck",
    roleColor: "#8B8B8B",
    content: "Requirements look complete. I've finalized the approval gate definition: all permission changes require Super Admin sign-off, audit log entries are immutable, and the Build phase must enforce tenant isolation. Handing over to Build with confidence.",
    timestamp: "2026-03-21T08:40:55Z",
    artifacts: ["approval-gate-definition.md"],
  },
];

export const RBAC_PLAN_LOG: SessionLogEntry[] = [
  { id: "pl1", timestamp: "2026-03-21T08:15:00Z", action: "Phase started", role: "Symphony", details: "Plan phase initiated for NCP-1252" },
  { id: "pl2", timestamp: "2026-03-21T08:15:05Z", action: "Role joined", role: "Requirements Dev", details: "Connected to Jira and Confluence via MCP" },
  { id: "pl3", timestamp: "2026-03-21T08:15:08Z", action: "Role joined", role: "Process Leader", details: "SOP validation mode activated" },
  { id: "pl4", timestamp: "2026-03-21T08:16:20Z", action: "Artifact received", role: "Requirements Dev", tool: "Jira MCP", details: "Loaded NCP-1200 epic context" },
  { id: "pl5", timestamp: "2026-03-21T08:19:45Z", action: "Cross-reference", role: "Process Leader", details: "Referencing SOC 2 compliance requirements" },
  { id: "pl6", timestamp: "2026-03-21T08:25:10Z", action: "Artifact created", role: "Requirements Dev", tool: "Confluence MCP", details: "RBAC Requirements Spec v1 published" },
  { id: "pl7", timestamp: "2026-03-21T08:30:22Z", action: "Security finding", role: "Process Leader", details: "Edge case: role downgrade with active sessions" },
  { id: "pl8", timestamp: "2026-03-21T08:36:40Z", action: "Artifact updated", role: "Requirements Dev", tool: "Confluence MCP", details: "Spec updated with role transition handling" },
  { id: "pl9", timestamp: "2026-03-21T08:40:55Z", action: "Artifact created", role: "Process Leader", tool: "Confluence MCP", details: "Approval Gate Definition finalized" },
  { id: "pl10", timestamp: "2026-03-21T08:42:00Z", action: "Phase ready", role: "Symphony", details: "Plan phase complete — triggering tollgate evaluation" },
];

/* ================================================================
   SESSION DATA — pre-built messages for NCP-1252 Deploy phase
   ================================================================ */

export const RBAC_DEPLOY_MESSAGES: SessionMessage[] = [
  {
    id: "dm1",
    role: "Agent Ops",
    roleIcon: "Activity",
    roleColor: "#FF8F5C",
    content: "Picking up Build artifacts from feature/ncp-1252-rbac. Running CI pipeline — linting, type checks, and 47 unit tests. All green. Preparing staging deployment.",
    timestamp: "2026-03-21T09:15:08Z",
    artifacts: ["ci-pipeline-log.txt"],
  },
  {
    id: "dm2",
    role: "Agent Ops",
    roleIcon: "Activity",
    roleColor: "#FF8F5C",
    content: "Deploying to staging environment via Vercel preview. Migration 001-rbac.sql applied successfully. RBAC middleware active on staging. Starting smoke tests...",
    timestamp: "2026-03-21T09:18:30Z",
    artifacts: ["staging-deploy-url.txt"],
  },
  {
    id: "dm3",
    role: "Agent Ops",
    roleIcon: "Activity",
    roleColor: "#FF8F5C",
    content: "Smoke tests passed: 12/12 endpoints responding correctly. Permission checks verified for all 4 roles. Tenant isolation confirmed — cross-tenant requests return 403. P95 latency: 45ms. Promoting to production.",
    timestamp: "2026-03-21T09:22:15Z",
    artifacts: ["smoke-test-report.json"],
  },
  {
    id: "dm4",
    role: "Agent Ops",
    roleIcon: "Activity",
    roleColor: "#FF8F5C",
    content: "Production deployment complete. CloudWatch alarms configured: error rate > 1%, P95 > 200ms, and permission denial spike > 50/min. Rollback procedure tested and documented. RBAC feature flag enabled for enterprise tier.",
    timestamp: "2026-03-21T09:26:40Z",
    artifacts: ["production-deploy-manifest.json", "rollback-procedure.md"],
  },
];

export const RBAC_DEPLOY_LOG: SessionLogEntry[] = [
  { id: "dl1", timestamp: "2026-03-21T09:14:00Z", action: "Phase started", role: "Symphony", details: "Deploy phase initiated for NCP-1252" },
  { id: "dl2", timestamp: "2026-03-21T09:14:05Z", action: "Role joined", role: "Agent Ops", details: "Connected to GitHub Actions, Vercel, and CloudWatch via MCP" },
  { id: "dl3", timestamp: "2026-03-21T09:15:08Z", action: "Tests passing", role: "Agent Ops", tool: "GitHub Actions", details: "CI pipeline: 47/47 tests, lint clean, types clean" },
  { id: "dl4", timestamp: "2026-03-21T09:18:30Z", action: "Code pushed", role: "Agent Ops", tool: "Vercel", details: "Staging deployment live at preview-ncp-1252.vercel.app" },
  { id: "dl5", timestamp: "2026-03-21T09:22:15Z", action: "Tests passing", role: "Agent Ops", tool: "GitHub Actions", details: "Smoke tests: 12/12 passed, P95: 45ms" },
  { id: "dl6", timestamp: "2026-03-21T09:26:40Z", action: "Code pushed", role: "Agent Ops", tool: "Vercel", details: "Production deployment complete — feature flag enabled" },
  { id: "dl7", timestamp: "2026-03-21T09:27:00Z", action: "MCP connected", role: "Agent Ops", tool: "CloudWatch", details: "Monitoring alarms configured" },
  { id: "dl8", timestamp: "2026-03-21T09:27:30Z", action: "Phase ready", role: "Symphony", details: "Deploy phase complete — triggering tollgate evaluation" },
];

/* ================================================================
   SESSION DATA — pre-built messages for NCP-1252 Build phase
   ================================================================ */

export const RBAC_BUILD_MESSAGES: SessionMessage[] = [
  {
    id: "m1",
    role: "Agent Engineer",
    roleIcon: "Cpu",
    roleColor: "#FF6B2C",
    content: "Analyzing the RBAC requirements spec from Plan phase. I see 4 roles (Super Admin, Account Manager, Support Agent, Viewer) with 12 permission groups across 8 admin pages. Starting with the middleware layer.",
    timestamp: "2026-03-21T08:45:12Z",
    artifacts: ["rbac-requirements-spec.md"],
  },
  {
    id: "m2",
    role: "Code Auditor",
    roleIcon: "ShieldCheck",
    roleColor: "#f87171",
    content: "I'll review the permission model as Agent Engineer builds it. Flagging from the Plan spec: the Process Leader noted that permission changes require Super Admin approval with audit logging. I'll verify that's enforced in the implementation.",
    timestamp: "2026-03-21T08:45:45Z",
    referencesRole: "Process Leader",
  },
  {
    id: "m3",
    role: "Agent Engineer",
    roleIcon: "Cpu",
    roleColor: "#FF6B2C",
    content: "Created the permission middleware. Using a hierarchical model — Super Admin inherits all permissions, Account Manager inherits Support Agent permissions, etc. Connected to GitHub via MCP — pushing to feature/ncp-1252-rbac branch.",
    timestamp: "2026-03-21T08:52:30Z",
    artifacts: ["rbac-middleware.ts"],
  },
  {
    id: "m4",
    role: "Code Auditor",
    roleIcon: "ShieldCheck",
    roleColor: "#f87171",
    content: "Reviewing rbac-middleware.ts. The hierarchy model is clean, but I found an issue: the permission check doesn't validate the user's tenant scope. A Super Admin in Tenant A could technically modify Tenant B's users. Adding tenant isolation to my review notes.",
    timestamp: "2026-03-21T08:56:18Z",
    referencesRole: "Agent Engineer",
  },
  {
    id: "m5",
    role: "Agent Engineer",
    roleIcon: "Cpu",
    roleColor: "#FF6B2C",
    content: "Good catch. Adding tenant_id scoping to every permission check. Updated the middleware to include `AND tenant_id = $currentTenant` in all authorization queries. Also added 47 unit tests covering all role × resource × action combinations.",
    timestamp: "2026-03-21T09:04:42Z",
    artifacts: ["rbac-middleware.ts", "rbac.test.ts"],
  },
  {
    id: "m6",
    role: "Code Auditor",
    roleIcon: "ShieldCheck",
    roleColor: "#f87171",
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
   STORY-AWARE SESSION MESSAGE GENERATION
   ================================================================ */

export function generateSessionMessages(story: JiraStory, phaseId: PhaseId): { messages: SessionMessage[]; log: SessionLogEntry[] } {
  // For s6, use the specific RBAC messages
  if (story.id === "s6") {
    if (phaseId === "plan") return { messages: RBAC_PLAN_MESSAGES, log: RBAC_PLAN_LOG };
    if (phaseId === "deploy") return { messages: RBAC_DEPLOY_MESSAGES, log: RBAC_DEPLOY_LOG };
    return { messages: RBAC_BUILD_MESSAGES, log: RBAC_BUILD_LOG };
  }

  // For other stories, generate contextual messages
  const storyContext = `${story.title} (${story.key})`;
  const component = story.component;
  const hash = stableHash(story.id + phaseId);

  if (phaseId === "plan") {
    return {
      messages: [
        {
          id: "gm1", role: "Requirements Dev", roleIcon: "FileText", roleColor: "#FF6B2C",
          content: `Analyzing requirements for ${storyContext}. Pulling acceptance criteria from Jira and scanning related documentation in Confluence for the ${component} module.`,
          timestamp: new Date().toISOString(),
          artifacts: [`${story.key}-requirements-spec.md`],
        },
        {
          id: "gm2", role: "Process Leader", roleIcon: "ClipboardCheck", roleColor: "#8B8B8B",
          content: `Reviewing the requirements spec. Building the approval gate definition and identifying edge cases specific to the ${component} module. Checking SOC 2 compliance requirements for this change.`,
          timestamp: new Date().toISOString(),
        },
        {
          id: "gm3", role: "Requirements Dev", roleIcon: "FileText", roleColor: "#FF6B2C",
          content: `Requirements spec complete. Identified ${(hash % 3) + 3} key acceptance criteria and ${(hash % 2) + 2} edge cases from Process Leader's review. Documenting in Confluence via MCP.`,
          timestamp: new Date().toISOString(),
          artifacts: [`${story.key}-requirements-spec.md`, `${story.key}-edge-cases.md`],
        },
        {
          id: "gm4", role: "Process Leader", roleIcon: "ClipboardCheck", roleColor: "#8B8B8B",
          content: `Approval gates defined. All requirements validated against the ${component} module's existing patterns. Ready for tollgate evaluation.`,
          timestamp: new Date().toISOString(),
          artifacts: [`${story.key}-approval-gates.md`],
        },
      ],
      log: [
        { id: "gl1", timestamp: new Date().toISOString(), action: "Phase started", role: "Symphony", details: `Plan phase initiated for ${story.key}` },
        { id: "gl2", timestamp: new Date().toISOString(), action: "Role joined", role: "Requirements Dev", details: "Connected to Jira and Confluence via MCP" },
        { id: "gl3", timestamp: new Date().toISOString(), action: "Role joined", role: "Process Leader", details: "Compliance review mode activated" },
        { id: "gl4", timestamp: new Date().toISOString(), action: "Artifact created", role: "Requirements Dev", tool: "Confluence MCP", details: "Requirements spec published" },
        { id: "gl5", timestamp: new Date().toISOString(), action: "Review complete", role: "Process Leader", details: "Approval gates and edge cases documented" },
        { id: "gl6", timestamp: new Date().toISOString(), action: "Phase ready", role: "Symphony", details: `Plan phase complete — triggering tollgate evaluation` },
      ],
    };
  }

  if (phaseId === "deploy") {
    return {
      messages: [
        {
          id: "gm1", role: "Agent Ops", roleIcon: "Activity", roleColor: "#FF8F5C",
          content: `Starting deployment pipeline for ${storyContext}. Running CI/CD workflow on GitHub Actions. Building Docker image and running integration tests.`,
          timestamp: new Date().toISOString(),
          artifacts: [`ci-pipeline-log.txt`],
        },
        {
          id: "gm2", role: "Agent Ops", roleIcon: "Activity", roleColor: "#FF8F5C",
          content: `CI passed. Deploying to staging environment first. Running smoke tests against the ${component} module endpoints.`,
          timestamp: new Date().toISOString(),
          artifacts: [`staging-deploy-url.txt`],
        },
        {
          id: "gm3", role: "Agent Ops", roleIcon: "Activity", roleColor: "#FF8F5C",
          content: `Staging validation complete. All smoke tests passed. Promoting to production. Configuring monitoring dashboards and alert rules in CloudWatch.`,
          timestamp: new Date().toISOString(),
          artifacts: [`smoke-test-report.json`],
        },
        {
          id: "gm4", role: "Agent Ops", roleIcon: "Activity", roleColor: "#FF8F5C",
          content: `Production deployment complete. Rollback procedure documented and tested. Monitoring configured with alerts for error rate > 1% and p95 latency > 500ms. Ready for tollgate.`,
          timestamp: new Date().toISOString(),
          artifacts: [`production-deploy-manifest.json`, `rollback-procedure.md`],
        },
      ],
      log: [
        { id: "gl1", timestamp: new Date().toISOString(), action: "Phase started", role: "Symphony", details: `Deploy phase initiated for ${story.key}` },
        { id: "gl2", timestamp: new Date().toISOString(), action: "Role joined", role: "Agent Ops", details: "Connected to GitHub Actions, CloudWatch via MCP" },
        { id: "gl3", timestamp: new Date().toISOString(), action: "CI/CD triggered", role: "Agent Ops", tool: "GitHub Actions", details: "Build + test pipeline started" },
        { id: "gl4", timestamp: new Date().toISOString(), action: "Staging deployed", role: "Agent Ops", tool: "Vercel", details: "Staging environment updated" },
        { id: "gl5", timestamp: new Date().toISOString(), action: "Smoke tests", role: "Agent Ops", details: "All smoke tests passed" },
        { id: "gl6", timestamp: new Date().toISOString(), action: "Production deployed", role: "Agent Ops", tool: "Vercel", details: "Production deployment complete" },
        { id: "gl7", timestamp: new Date().toISOString(), action: "Phase ready", role: "Symphony", details: `Deploy phase complete — triggering tollgate evaluation` },
      ],
    };
  }

  // Build phase (default)
  const testCount = 25 + (hash % 20); // 25-44, deterministic
  return {
    messages: [
      {
        id: "gm1", role: "Agent Engineer", roleIcon: "Cpu", roleColor: "#FF6B2C",
        content: `Analyzing the requirements spec from Plan phase for ${storyContext}. Scanning the ${component} module codebase to understand existing patterns and dependencies.`,
        timestamp: new Date().toISOString(),
        artifacts: [`${story.key}-requirements-spec.md`],
      },
      {
        id: "gm2", role: "Code Auditor", roleIcon: "ShieldCheck", roleColor: "#f87171",
        content: `I'll review code as Agent Engineer builds. Checking the ${component} module's security posture and recent vulnerability history. Will flag any issues inline.`,
        timestamp: new Date().toISOString(),
        referencesRole: "Agent Engineer",
      },
      {
        id: "gm3", role: "Agent Engineer", roleIcon: "Cpu", roleColor: "#FF6B2C",
        content: `Implementation in progress. Following the existing patterns in the ${component} module. Connected to GitHub via MCP — pushing to feature/${story.key.toLowerCase()} branch.`,
        timestamp: new Date().toISOString(),
        artifacts: [`${component}-implementation.ts`],
      },
      {
        id: "gm4", role: "Code Auditor", roleIcon: "ShieldCheck", roleColor: "#f87171",
        content: `Reviewing the implementation. Checking for input validation, proper error handling, and alignment with the requirements spec. Running security scan now.`,
        timestamp: new Date().toISOString(),
        referencesRole: "Agent Engineer",
      },
      {
        id: "gm5", role: "Agent Engineer", roleIcon: "Cpu", roleColor: "#FF6B2C",
        content: `Addressed Code Auditor's review comments. Added comprehensive test coverage — ${testCount} unit tests covering the main scenarios. All tests passing.`,
        timestamp: new Date().toISOString(),
        artifacts: [`${component}-implementation.ts`, `${component}.test.ts`],
      },
      {
        id: "gm6", role: "Code Auditor", roleIcon: "ShieldCheck", roleColor: "#f87171",
        content: `Final review complete. All ${testCount} tests passing. Security scan clear — no vulnerabilities detected. Code follows ${component} module conventions. Ready for tollgate.`,
        timestamp: new Date().toISOString(),
      },
    ],
    log: [
      { id: "gl1", timestamp: new Date().toISOString(), action: "Phase started", role: "Symphony", details: `Build phase initiated for ${story.key}` },
      { id: "gl2", timestamp: new Date().toISOString(), action: "Role joined", role: "Agent Engineer", details: "Connected to Claude Code via MCP" },
      { id: "gl3", timestamp: new Date().toISOString(), action: "Role joined", role: "Code Auditor", details: "Security review mode activated" },
      { id: "gl4", timestamp: new Date().toISOString(), action: "Artifact received", role: "Agent Engineer", tool: "Confluence MCP", details: "Loaded requirements spec from Plan phase" },
      { id: "gl5", timestamp: new Date().toISOString(), action: "Code pushed", role: "Agent Engineer", tool: "GitHub MCP", details: `feature/${story.key.toLowerCase()} branch created` },
      { id: "gl6", timestamp: new Date().toISOString(), action: "Review complete", role: "Code Auditor", tool: "Snyk MCP", details: "Security scan clean" },
      { id: "gl7", timestamp: new Date().toISOString(), action: "Phase ready", role: "Symphony", details: `Build phase complete — triggering tollgate evaluation` },
    ],
  };
}

/* ================================================================
   AGENT REPLY GENERATION — contextual chat replies
   ================================================================ */

export function generateAgentReply(story: JiraStory, phaseId: PhaseId, userMessage: string): SessionMessage {
  const activeRoles = story.blueprint?.phases.find(p => p.id === phaseId)?.roles ?? ["Agent Engineer"];
  const primaryRole = activeRoles[0];
  const roleColors: Record<string, string> = {
    "Requirements Dev": "#FF6B2C", "Process Leader": "#8B8B8B",
    "Agent Engineer": "#FF6B2C", "Code Auditor": "#f87171", "Agent Ops": "#FF8F5C",
  };
  const roleIcons: Record<string, string> = {
    "Requirements Dev": "FileText", "Process Leader": "ClipboardCheck",
    "Agent Engineer": "Cpu", "Code Auditor": "ShieldCheck", "Agent Ops": "Activity",
  };

  const lowerMsg = userMessage.toLowerCase();
  let content: string;

  if (lowerMsg.includes("status") || lowerMsg.includes("progress") || lowerMsg.includes("how")) {
    content = `Current progress on ${story.key}: We're in the ${phaseId} phase working on the ${story.component} module. All checks are passing and we're on track with the estimated timeline.`;
  } else if (lowerMsg.includes("stop") || lowerMsg.includes("pause") || lowerMsg.includes("wait")) {
    content = `Understood. Pausing current work on ${story.key}. All progress is saved. You can resume anytime by typing "continue" or clicking the phase controls.`;
  } else if (lowerMsg.includes("why") || lowerMsg.includes("explain") || lowerMsg.includes("reason")) {
    content = `Good question. For ${story.title}, we chose this approach because the ${story.component} module's existing patterns support it well. The historical data from similar stories (${story.blueprint?.historicalComparison?.similarStories?.join(", ") ?? "previous sprints"}) informed our strategy.`;
  } else if (lowerMsg.includes("risk") || lowerMsg.includes("concern") || lowerMsg.includes("issue")) {
    content = `Flagging your concern for ${story.key}. I've added it to the risk register for the current ${phaseId} phase. The tollgate evaluation will factor this in. The Code Auditor will also review this during the security pass.`;
  } else if (lowerMsg.includes("test") || lowerMsg.includes("coverage")) {
    content = `Test coverage for ${story.key} is currently tracking well. We have comprehensive unit tests covering the main scenarios for the ${story.component} module. Integration tests will run during the tollgate evaluation.`;
  } else {
    content = `Noted — factoring that into the current ${phaseId} phase for ${story.key}. I'll coordinate with ${activeRoles.length > 1 ? activeRoles[1] : "the team"} to incorporate your input. This will be reflected in the next tollgate evaluation.`;
  }

  return {
    id: `reply-${Date.now()}`,
    role: primaryRole,
    roleIcon: roleIcons[primaryRole] ?? "Cpu",
    roleColor: roleColors[primaryRole] ?? "#888",
    content,
    timestamp: new Date().toISOString(),
  };
}

/* ================================================================
   ROLES CATALOG (for display)
   ================================================================ */

export const ROLE_CATALOG = [
  { id: "Requirements Dev", icon: "FileText", color: "#FF6B2C", description: "Translates business needs into structured specs" },
  { id: "Process Leader", icon: "ClipboardCheck", color: "#8B8B8B", description: "Builds SOPs, edge cases, and approval gates" },
  { id: "Data Steward", icon: "Database", color: "#666666", description: "Validates data schemas and quality constraints" },
  { id: "Agent Engineer", icon: "Cpu", color: "#FF6B2C", description: "Builds, tests, and validates implementations" },
  { id: "Code Auditor", icon: "ShieldCheck", color: "#f87171", description: "Security scanning and code quality review" },
  { id: "UX Designer", icon: "Palette", color: "#999999", description: "Interface design and usability validation" },
  { id: "Architect", icon: "Network", color: "#777777", description: "Technical architecture and system design" },
  { id: "Agent Ops", icon: "Activity", color: "#FF8F5C", description: "Deploys, monitors, and manages production" },
] as const;

/* ================================================================
   COCKPIT METRICS
   ================================================================ */

export const COCKPIT_METRICS = {
  sprint: {
    id: "sprint-14",
    name: "Sprint 14",
    startDate: "2026-03-10",
    endDate: "2026-03-24",
    storiesTotal: 14,
    storiesCompleted: 9,
    storiesInSymphony: 2,
    storiesRemaining: 3,
  },
  roi: {
    symphonyHours: 112,
    traditionalHours: 280,
    symphonyCost: 16800,
    traditionalCost: 42000,
    timeSavedPct: 60,
    costSavedPct: 60,
  },
  quality: {
    avgTollgateScore: 91.4,
    tollgatePassRate: 85,
    securityIssuesCaught: 7,
    overrides: 1,
  },
  costBreakdown: [
    { role: "Requirements Dev", model: "Claude Opus 4.6", tokens: 890000, cost: 26.70 },
    { role: "Process Leader", model: "Claude Sonnet 4", tokens: 420000, cost: 4.20 },
    { role: "Agent Engineer", model: "Claude Opus 4.6", tokens: 2450000, cost: 73.50 },
    { role: "Code Auditor", model: "Claude Sonnet 4", tokens: 680000, cost: 6.80 },
    { role: "Agent Ops", model: "Claude Haiku 4.5", tokens: 310000, cost: 0.16 },
  ],
  auditTrail: [
    { time: "09:28", event: "Tollgate BLOCKED", story: "NCP-1253", detail: "Security scan failed — CVE-2026-3891", severity: "critical" },
    { time: "09:13", event: "Phase completed", story: "NCP-1252", detail: "Build phase passed tollgate (96/100)", severity: "info" },
    { time: "08:42", event: "Tollgate passed", story: "NCP-1252", detail: "Plan phase — requirements complete", severity: "success" },
    { time: "08:15", event: "Story pulled", story: "NCP-1252", detail: "Blueprint approved — 3 phases, est. $8.40", severity: "info" },
    { time: "08:02", event: "Sprint started", story: "—", detail: "Sprint 14 — 14 stories, 3 in Symphony", severity: "info" },
  ],
};
