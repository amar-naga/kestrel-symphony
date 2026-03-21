"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import {
  X,
  Cpu,
  ShieldCheck,
  Activity,
  Zap,
  Brain,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle,
  AlertTriangle,
  Settings,
  Wrench,
  Database,
  FileText,
  Lock,
  Unlock,
  TrendingUp,
  MessageSquare,
  GitBranch,
  CircleDot,
  ChevronRight,
  Server,
  Globe,
  Eye,
  Gauge,
  BookOpen,
} from "lucide-react";

/* ================================================================
   TYPES
   ================================================================ */

type InspectorTab = "engine" | "wiring" | "guardrails" | "context" | "knowledge";

/* ================================================================
   SIMULATED DATA
   ================================================================ */

const ENGINE_CONFIG = {
  selected: "CrewAI Flows",
  version: "v0.4.2",
  reason: "Team has 3+ agents with sequential handoffs and tollgate governance — CrewAI Flows optimal for structured multi-stage pipelines.",
  alternatives: [
    { name: "LangGraph", fit: 72, reason: "Better for cyclic agent graphs, overkill for linear pipelines" },
    { name: "AutoGen", fit: 58, reason: "Stronger for open-ended multi-turn debate, less suited for governed SDLC" },
  ],
  llmRouting: [
    { role: "Requirements Dev", model: "Claude Opus 4.6", costPer1k: 0.015, reason: "Complex reasoning — translating ambiguous requirements into structured specs", tokens: 24200 },
    { role: "Process Leader", model: "Claude Sonnet 4", costPer1k: 0.003, reason: "Structured validation — pattern matching against SOPs", tokens: 12400 },
    { role: "Agent Engineer", model: "Claude Opus 4.6", costPer1k: 0.015, reason: "Code generation — producing correct, tested implementations", tokens: 38100 },
    { role: "Code Auditor", model: "Claude Sonnet 4", costPer1k: 0.003, reason: "Security scanning — pattern matching against CVE databases", tokens: 18900 },
    { role: "Agent Ops", model: "Claude Haiku 4.5", costPer1k: 0.001, reason: "Monitoring and routing — high-volume, low-complexity tasks", tokens: 8200 },
  ],
};

const AGENT_WIRING = [
  { from: "Agent Engineer", to: "Code Auditor", protocol: "A2A", type: "peer-review", direction: "bidirectional", messages: 12, active: true },
  { from: "Agent Engineer", to: "GitHub", protocol: "MCP", type: "tool-use", direction: "outbound", messages: 8, active: true },
  { from: "Code Auditor", to: "Snyk", protocol: "MCP", type: "tool-use", direction: "outbound", messages: 3, active: false },
  { from: "Code Auditor", to: "Plan Phase", protocol: "Context", type: "artifact-read", direction: "inbound", messages: 2, active: false },
  { from: "Agent Engineer", to: "Confluence", protocol: "MCP", type: "tool-use", direction: "outbound", messages: 4, active: false },
  { from: "Agent Ops", to: "GitHub Actions", protocol: "MCP", type: "tool-use", direction: "outbound", messages: 0, active: false },
  { from: "Agent Ops", to: "CloudWatch", protocol: "MCP", type: "tool-use", direction: "outbound", messages: 0, active: false },
];

const MCP_CONNECTIONS = [
  { name: "GitHub", status: "connected", calls: 8, lastCall: "2m ago", auth: "OAuth token" },
  { name: "Jira", status: "connected", calls: 3, lastCall: "12m ago", auth: "API key" },
  { name: "Confluence", status: "connected", calls: 4, lastCall: "8m ago", auth: "OAuth token" },
  { name: "Snyk", status: "connected", calls: 3, lastCall: "4m ago", auth: "API key" },
  { name: "Supabase", status: "idle", calls: 0, lastCall: "—", auth: "Service key" },
  { name: "CloudWatch", status: "idle", calls: 0, lastCall: "—", auth: "IAM role" },
];

const GUARDRAILS = {
  tokenBudget: { used: 12400, limit: 50000 },
  costCap: { used: 4.20, limit: 15.00 },
  qualityFloor: { current: 91.4, minimum: 80 },
  autoPause: { enabled: true, threshold: 50, triggered: false },
  maxRetries: 2,
  retriesUsed: 0,
  rules: [
    { name: "Token limit per story", value: "50,000 tokens", status: "healthy", icon: "gauge" },
    { name: "Cost cap per story", value: "$15.00", status: "healthy", icon: "dollar" },
    { name: "Quality floor", value: "80% minimum tollgate score", status: "healthy", icon: "shield" },
    { name: "Auto-pause", value: "Triggers at $50/story", status: "armed", icon: "pause" },
    { name: "Max tollgate retries", value: "2 attempts before escalation", status: "healthy", icon: "retry" },
    { name: "Sensitive data filter", value: "Block PII in agent outputs", status: "active", icon: "lock" },
    { name: "Code review required", value: "Human must approve PRs > 500 lines", status: "active", icon: "eye" },
    { name: "Dependency check", value: "Block deploy if CVE score > 7.0", status: "active", icon: "shield" },
  ],
};

const CONTEXT_FLOW = {
  phases: [
    {
      from: "Plan",
      to: "Build",
      artifacts: [
        { name: "RBAC Requirements Spec", size: "4.2KB", tokens: 1840, status: "delivered" },
        { name: "Approval Gate Definition", size: "1.8KB", tokens: 780, status: "delivered" },
      ],
      decisions: [
        "Chose hierarchical RBAC over flat model",
        "Super Admin inherits all lower permissions",
        "Audit log required for all permission changes",
      ],
      risks: ["Tenant isolation is critical — must scope all permission checks"],
      strategy: "Summarize + attach",
      tokensSaved: "62%",
    },
    {
      from: "Build",
      to: "Deploy",
      artifacts: [
        { name: "rbac-middleware.ts", size: "8.1KB", tokens: 3200, status: "pending" },
        { name: "rbac.test.ts", size: "6.4KB", tokens: 2600, status: "pending" },
        { name: "migration-001-rbac.sql", size: "1.2KB", tokens: 480, status: "pending" },
      ],
      decisions: [
        "Added tenant_id scoping after Code Auditor review",
        "47 unit tests covering all role × resource combinations",
      ],
      risks: ["Monitor for performance impact on permission checks at scale"],
      strategy: "Full context (deploy needs exact artifacts)",
      tokensSaved: "0%",
    },
  ],
};

const KNOWLEDGE = {
  patterns: [
    {
      module: "auth",
      finding: "3 of last 8 stories failed security tollgate",
      action: "Auto-adding Code Auditor to all auth stories",
      confidence: 94,
      impact: "high",
    },
    {
      module: "search",
      finding: "2 performance regressions in last 5 deploys",
      action: "Auto-adding perf benchmark to search tollgates",
      confidence: 87,
      impact: "medium",
    },
    {
      module: "data",
      finding: "Migration stories take 2.3x longer than estimated",
      action: "Adjusted time estimates for data module stories +40%",
      confidence: 91,
      impact: "medium",
    },
  ],
  feedbackThisRun: [
    { timestamp: "09:04", entry: '"Tenant isolation gap" added to auth security checklist', source: "Code Auditor" },
    { timestamp: "09:12", entry: '"SQL parameterization" added to search guardrails', source: "Code Auditor" },
    { timestamp: "08:42", entry: '"Hierarchical RBAC" documented as team pattern for auth module', source: "Requirements Dev" },
  ],
  repoStats: {
    storiesProcessed: 147,
    patternsDetected: 23,
    guardrailsAdded: 8,
    avgQualityImprovement: "+12% since knowledge loop activated",
  },
};

/* ================================================================
   HELPERS
   ================================================================ */

const ROLE_COLORS: Record<string, string> = {
  "Requirements Dev": "#FF6B2C",
  "Process Leader": "#8B8B8B",
  "Data Steward": "#FF8F5C",
  "Agent Engineer": "#FF6B2C",
  "Code Auditor": "#f87171",
  "Agent Ops": "#FF8F5C",
};

function ProgressBar({ value, max, color, showLabel = true }: { value: number; max: number; color: string; showLabel?: boolean }) {
  const pct = Math.min((value / max) * 100, 100);
  const isHealthy = pct < 70;
  const isWarning = pct >= 70 && pct < 90;
  const barColor = isHealthy ? color : isWarning ? "#f59e0b" : "#f87171";

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] font-mono tabular-nums shrink-0" style={{ color: barColor }}>
          {pct.toFixed(0)}%
        </span>
      )}
    </div>
  );
}

/* ================================================================
   TAB: ENGINE & LLM
   ================================================================ */

function EngineTab() {
  return (
    <div className="space-y-5 p-5">
      {/* Engine Selection */}
      <div>
        <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">Orchestration Engine</div>
        <div
          className="rounded-xl p-4 relative overflow-hidden"
          style={{
            background: "rgba(255,107,44,0.06)",
            border: "1px solid rgba(255,107,44,0.2)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B2C]/20 flex items-center justify-center">
              <Server size={16} className="text-[#FF6B2C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white/90">{ENGINE_CONFIG.selected}</span>
                <span className="text-[10px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
                  {ENGINE_CONFIG.version}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  selected
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-white/40 leading-relaxed pl-11">{ENGINE_CONFIG.reason}</p>
        </div>

        {/* Alternatives considered */}
        <div className="mt-3 space-y-2">
          {ENGINE_CONFIG.alternatives.map((alt) => (
            <div
              key={alt.name}
              className="rounded-lg p-3 flex items-center gap-3"
              style={{
                background: "var(--surface-secondary)",
                border: "1px solid var(--border-secondary)",
              }}
            >
              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Server size={14} className="text-white/30" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white/50">{alt.name}</span>
                  <span className="text-[10px] font-mono text-white/20">{alt.fit}% fit</span>
                </div>
                <p className="text-[11px] text-white/25 mt-0.5">{alt.reason}</p>
              </div>
              <div className="w-12">
                <ProgressBar value={alt.fit} max={100} color="#6b7280" showLabel={false} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LLM Routing Table */}
      <div>
        <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">LLM Routing Per Role</div>
        <div className="space-y-2">
          {ENGINE_CONFIG.llmRouting.map((row, i) => {
            const roleColor = ROLE_COLORS[row.role] ?? "#888";
            const modelColor =
              row.model.includes("Opus") ? "#f59e0b" :
              row.model.includes("Sonnet") ? "#FF6B2C" :
              "#FF8F5C";

            return (
              <motion.div
                key={row.role}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-lg p-3"
                style={{
                  background: "var(--surface-secondary)",
                  border: "1px solid var(--border-secondary)",
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: roleColor }}
                  >
                    {row.role}
                  </span>
                  <ArrowRight size={10} className="text-white/15" />
                  <span
                    className="text-xs font-bold"
                    style={{ color: modelColor }}
                  >
                    {row.model}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-white/20">
                    ${row.costPer1k}/1K tokens
                  </span>
                </div>
                <p className="text-[11px] text-white/30 leading-relaxed">{row.reason}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-mono text-white/15">
                    {(row.tokens / 1000).toFixed(1)}K tokens used
                  </span>
                  <div className="flex-1">
                    <ProgressBar value={row.tokens} max={50000} color={modelColor} showLabel={false} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Total cost */}
        <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
          <span className="text-[10px] font-mono text-white/30">Total LLM cost this story</span>
          <span className="text-sm font-bold text-[#f59e0b] tabular-nums">
            ${ENGINE_CONFIG.llmRouting.reduce((a, r) => a + (r.tokens / 1000) * r.costPer1k, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TAB: AGENT WIRING
   ================================================================ */

function WiringTab() {
  return (
    <div className="space-y-5 p-5">
      {/* Agent Connections */}
      <div>
        <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">Agent Connections (Live)</div>
        <div className="space-y-2">
          {AGENT_WIRING.map((wire, i) => {
            const fromColor = ROLE_COLORS[wire.from] ?? "#888";
            const protocolColor =
              wire.protocol === "A2A" ? "#8B8B8B" :
              wire.protocol === "MCP" ? "#888888" :
              "#f59e0b";

            return (
              <motion.div
                key={`${wire.from}-${wire.to}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-lg p-3 relative"
                style={{
                  background: wire.active ? "rgba(255,107,44,0.04)" : "var(--surface-secondary)",
                  border: wire.active ? "1px solid rgba(255,107,44,0.15)" : "1px solid var(--border-secondary)",
                }}
              >
                <div className="flex items-center gap-2">
                  {/* From */}
                  <span className="text-xs font-semibold" style={{ color: fromColor }}>
                    {wire.from}
                  </span>

                  {/* Direction arrow */}
                  {wire.direction === "bidirectional" ? (
                    <ArrowLeftRight size={12} style={{ color: protocolColor }} />
                  ) : wire.direction === "inbound" ? (
                    <ArrowRight size={12} className="rotate-180" style={{ color: protocolColor }} />
                  ) : (
                    <ArrowRight size={12} style={{ color: protocolColor }} />
                  )}

                  {/* To */}
                  <span className="text-xs font-semibold text-white/60">{wire.to}</span>

                  {/* Protocol badge */}
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ml-auto"
                    style={{
                      background: `${protocolColor}15`,
                      color: protocolColor,
                      border: `1px solid ${protocolColor}25`,
                    }}
                  >
                    {wire.protocol}
                  </span>

                  {/* Message count */}
                  <span className="text-[10px] font-mono text-white/20 tabular-nums">
                    {wire.messages} msgs
                  </span>

                  {/* Active indicator */}
                  {wire.active && (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-emerald-400"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Type label */}
                <div className="mt-1 pl-0">
                  <span className="text-[10px] text-white/20 font-mono">{wire.type}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* MCP Connection Status */}
      <div>
        <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">MCP Server Status</div>
        <div className="space-y-1.5">
          {MCP_CONNECTIONS.map((mcp, i) => (
            <motion.div
              key={mcp.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg"
              style={{
                background: "var(--surface-secondary)",
                border: "1px solid var(--border-secondary)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: mcp.status === "connected" ? "#FF8F5C" : "#6b7280",
                  boxShadow: mcp.status === "connected" ? "0 0 6px #FF8F5C60" : "none",
                }}
              />
              <span className="text-xs font-semibold text-white/60 w-24">{mcp.name}</span>
              <span className="text-[10px] font-mono text-white/20">{mcp.calls} calls</span>
              <span className="text-[10px] font-mono text-white/15 ml-auto">{mcp.lastCall}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/20 font-mono">
                {mcp.auth}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TAB: GUARDRAILS
   ================================================================ */

function GuardrailsTab() {
  const [liveTokens, setLiveTokens] = useState(GUARDRAILS.tokenBudget.used);
  const [liveCost, setLiveCost] = useState(GUARDRAILS.costCap.used);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTokens((prev) => Math.min(prev + Math.floor(Math.random() * 80 + 20), GUARDRAILS.tokenBudget.limit));
      setLiveCost((prev) => Math.min(prev + Math.random() * 0.002, GUARDRAILS.costCap.limit));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5 p-5">
      {/* Live Meters */}
      <div>
        <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">Live Resource Meters</div>
        <div className="space-y-3">
          {/* Token Budget */}
          <div className="rounded-lg p-3" style={{ background: "var(--surface-secondary)", border: "1px solid var(--border-secondary)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/60 flex items-center gap-1.5">
                <Gauge size={12} className="text-[#FF6B2C]" />
                Token Budget
              </span>
              <motion.span
                className="text-xs font-mono tabular-nums"
                key={liveTokens}
                initial={{ color: "#FF6B2C" }}
                animate={{ color: "rgba(255,255,255,0.4)" }}
                transition={{ duration: 1 }}
              >
                {liveTokens.toLocaleString()} / {GUARDRAILS.tokenBudget.limit.toLocaleString()}
              </motion.span>
            </div>
            <ProgressBar value={liveTokens} max={GUARDRAILS.tokenBudget.limit} color="#FF6B2C" />
          </div>

          {/* Cost Cap */}
          <div className="rounded-lg p-3" style={{ background: "var(--surface-secondary)", border: "1px solid var(--border-secondary)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/60 flex items-center gap-1.5">
                <Gauge size={12} className="text-[#f59e0b]" />
                Cost Cap
              </span>
              <motion.span
                className="text-xs font-mono tabular-nums"
                key={Math.floor(liveCost * 100)}
                initial={{ color: "#f59e0b" }}
                animate={{ color: "rgba(255,255,255,0.4)" }}
                transition={{ duration: 1 }}
              >
                ${liveCost.toFixed(2)} / ${GUARDRAILS.costCap.limit.toFixed(2)}
              </motion.span>
            </div>
            <ProgressBar value={liveCost} max={GUARDRAILS.costCap.limit} color="#f59e0b" />
          </div>

          {/* Quality Floor */}
          <div className="rounded-lg p-3" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.15)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/60 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-[#FF8F5C]" />
                Quality Floor
              </span>
              <span className="text-xs font-mono text-[#FF8F5C] tabular-nums">
                {GUARDRAILS.qualityFloor.current}% (min: {GUARDRAILS.qualityFloor.minimum}%)
              </span>
            </div>
            <ProgressBar value={GUARDRAILS.qualityFloor.current} max={100} color="#FF8F5C" />
            <div className="mt-1 text-[9px] font-mono text-emerald-400/50 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={8} /> healthy
            </div>
          </div>
        </div>
      </div>

      {/* Guardrail Rules */}
      <div>
        <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">Active Guardrails</div>
        <div className="space-y-1.5">
          {GUARDRAILS.rules.map((rule, i) => {
            const statusColor =
              rule.status === "healthy" ? "#FF8F5C" :
              rule.status === "active" ? "#FF6B2C" :
              rule.status === "armed" ? "#f59e0b" :
              "#f87171";

            return (
              <motion.div
                key={rule.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.04 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{
                  background: "var(--surface-secondary)",
                  border: "1px solid var(--border-secondary)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}40` }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-white/60">{rule.name}</span>
                  <p className="text-[10px] text-white/25 mt-0.5">{rule.value}</p>
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                  style={{
                    background: `${statusColor}12`,
                    color: statusColor,
                    border: `1px solid ${statusColor}20`,
                  }}
                >
                  {rule.status}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TAB: CONTEXT FLOW
   ================================================================ */

function ContextTab() {
  return (
    <div className="space-y-5 p-5">
      <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-1">Phase Handover Context</div>

      {CONTEXT_FLOW.phases.map((flow, fi) => {
        const fromColor = flow.from === "Plan" ? "#FF6B2C" : "#f59e0b";
        const toColor = flow.to === "Build" ? "#f59e0b" : "#FF8F5C";

        return (
          <motion.div
            key={`${flow.from}-${flow.to}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: fi * 0.15 }}
            className="rounded-xl overflow-hidden"
            style={{
              background: "var(--surface-secondary)",
              border: "1px solid var(--border-secondary)",
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-2 border-b border-white/[0.04]" style={{ background: "var(--surface-secondary)" }}>
              <span className="text-xs font-bold" style={{ color: fromColor }}>{flow.from}</span>
              <ArrowRight size={12} className="text-white/20" />
              <span className="text-xs font-bold" style={{ color: toColor }}>{flow.to}</span>
              <span className="ml-auto text-[9px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">
                Strategy: {flow.strategy}
              </span>
              {flow.tokensSaved !== "0%" && (
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {flow.tokensSaved} tokens saved
                </span>
              )}
            </div>

            <div className="p-4 space-y-3">
              {/* Artifacts */}
              <div>
                <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-2">Artifacts Passed</div>
                {flow.artifacts.map((a) => (
                  <div key={a.name} className="flex items-center gap-2 py-1.5 text-xs">
                    <CheckCircle size={12} className={a.status === "delivered" ? "text-emerald-400" : "text-white/15"} />
                    <span className="text-white/60 font-medium">{a.name}</span>
                    <span className="text-[10px] font-mono text-white/20 ml-auto">{a.size}</span>
                    <span className="text-[10px] font-mono text-white/15">{a.tokens.toLocaleString()} tokens</span>
                  </div>
                ))}
              </div>

              {/* Decisions */}
              <div>
                <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-2">Decisions Carried Forward</div>
                {flow.decisions.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 py-1 text-[11px] text-white/40">
                    <ChevronRight size={10} className="text-[#FF6B2C] mt-0.5 shrink-0" />
                    {d}
                  </div>
                ))}
              </div>

              {/* Risks */}
              <div>
                <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-2">Risk Flags</div>
                {flow.risks.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 py-1 text-[11px] text-amber-400/70">
                    <AlertTriangle size={10} className="mt-0.5 shrink-0" />
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ================================================================
   TAB: KNOWLEDGE & FEEDBACK
   ================================================================ */

function KnowledgeTab() {
  return (
    <div className="space-y-5 p-5">
      {/* Repository Stats */}
      <div className="rounded-xl p-4" style={{ background: "rgba(255,107,44,0.06)", border: "1px solid rgba(255,107,44,0.15)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Brain size={14} className="text-[#8B8B8B]" />
          <span className="text-xs font-bold text-white/70">Knowledge Repository</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Stories processed", value: KNOWLEDGE.repoStats.storiesProcessed },
            { label: "Patterns detected", value: KNOWLEDGE.repoStats.patternsDetected },
            { label: "Guardrails auto-added", value: KNOWLEDGE.repoStats.guardrailsAdded },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg font-bold text-[#8B8B8B] tabular-nums">{stat.value}</div>
              <div className="text-[9px] font-mono text-white/25">{stat.label}</div>
            </div>
          ))}
          <div className="text-center">
            <div className="text-sm font-bold text-emerald-400">+12%</div>
            <div className="text-[9px] font-mono text-white/25">quality improvement</div>
          </div>
        </div>
      </div>

      {/* Detected Patterns */}
      <div>
        <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">Detected Patterns</div>
        <div className="space-y-2">
          {KNOWLEDGE.patterns.map((pattern, i) => {
            const impactColor = pattern.impact === "high" ? "#f87171" : "#f59e0b";
            return (
              <motion.div
                key={pattern.module}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-lg p-3"
                style={{
                  background: "var(--surface-secondary)",
                  border: "1px solid var(--border-secondary)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white/60 font-mono">{pattern.module}</span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{ background: `${impactColor}12`, color: impactColor, border: `1px solid ${impactColor}20` }}
                  >
                    {pattern.impact}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-white/20">{pattern.confidence}% conf</span>
                </div>
                <div className="flex items-start gap-2 mt-1">
                  <AlertTriangle size={11} className="text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-white/40">{pattern.finding}</p>
                </div>
                <div className="flex items-start gap-2 mt-1">
                  <CheckCircle size={11} className="text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-emerald-400/70">{pattern.action}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Feedback This Run */}
      <div>
        <div className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">Feedback This Run</div>
        <div className="space-y-1.5">
          {KNOWLEDGE.feedbackThisRun.map((fb, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex items-start gap-3 px-3 py-2 rounded-lg text-xs"
              style={{
                background: "var(--surface-secondary)",
                border: "1px solid var(--border-secondary)",
              }}
            >
              <span className="text-[10px] font-mono text-white/20 shrink-0 tabular-nums mt-0.5">{fb.timestamp}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white/50 leading-relaxed">{fb.entry}</p>
                <span className="text-[10px] text-white/20 font-mono">Source: {fb.source}</span>
              </div>
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#8B8B8B] shrink-0 mt-1.5"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN: PLATFORM INSPECTOR
   ================================================================ */

const TABS: { id: InspectorTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "engine", label: "Engine & LLM", icon: Server },
  { id: "wiring", label: "Agent Wiring", icon: GitBranch },
  { id: "guardrails", label: "Guardrails", icon: ShieldCheck },
  { id: "context", label: "Context Flow", icon: ArrowLeftRight },
  { id: "knowledge", label: "Knowledge", icon: Brain },
];

export function PlatformInspector({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("engine");

  const tabContent: Record<InspectorTab, React.ReactNode> = {
    engine: <EngineTab />,
    wiring: <WiringTab />,
    guardrails: <GuardrailsTab />,
    context: <ContextTab />,
    knowledge: <KnowledgeTab />,
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[70] flex flex-col"
            style={{
              width: 640,
              background: "var(--panel-bg)",
              borderLeft: "1px solid var(--border-primary)",
              backdropFilter: "blur(32px)",
              boxShadow: "-20px 0 60px var(--panel-shadow)",
            }}
            initial={{ x: 640 }}
            animate={{ x: 0 }}
            exit={{ x: 640 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="shrink-0 px-5 py-4 flex items-center gap-3 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B2C]/20 to-[#8B8B8B]/20 flex items-center justify-center">
                <Settings size={16} className="text-[#8B8B8B]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-white/90">Platform Inspector</h2>
                <p className="text-[10px] text-white/30 font-mono">Behind the scenes — engine, wiring, guardrails</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="shrink-0 flex border-b border-white/[0.06] px-2 overflow-x-auto">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative px-3 py-3 text-[11px] font-semibold transition-colors shrink-0 flex items-center gap-1.5"
                    style={{ color: active ? "var(--text-primary)" : "var(--text-faint)" }}
                  >
                    <Icon size={12} />
                    {tab.label}
                    {active && (
                      <motion.div
                        layoutId="inspector-tab"
                        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                        style={{ background: "linear-gradient(90deg, #FF6B2C, #8B8B8B)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default PlatformInspector;
