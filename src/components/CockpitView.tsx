"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { COCKPIT_METRICS } from "@/lib/sample-data";
import {
  BarChart3,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Users,
  Zap,
  Activity,
  Eye,
  CircleDot,
  Terminal,
  GitBranch,
} from "lucide-react";

/* ================================================================
   HELPERS
   ================================================================ */

const { sprint, roi, quality, costBreakdown, auditTrail } = COCKPIT_METRICS;

const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  },
};

function formatCurrency(n: number) {
  return n >= 1000
    ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
    : `$${n.toFixed(2)}`;
}

/* ── Animated Counter ─────────────────────────────────────── */

function AnimatedCounter({ target, duration = 1.5, prefix = "", suffix = "", decimals = 0 }: {
  target: number; duration?: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(eased * target);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return <>{prefix}{count.toFixed(decimals)}{suffix}</>;
}

/* ── Mini Bar Chart (ROI comparison) ─────────────────────────── */

function RoiBarChart() {
  const maxH = 80;
  const symH = (roi.symphonyHours / roi.traditionalHours) * maxH;
  const tradH = maxH;

  return (
    <div className="flex items-end gap-3 h-[90px]">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-mono text-white/30">Symphony</span>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: symH }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-8 rounded-t-md"
          style={{ background: "linear-gradient(to top, #4ade80, #4ade8080)" }}
        />
        <span className="text-[10px] font-mono text-[#4ade80]">{roi.symphonyHours}h</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-mono text-white/30">Traditional</span>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: tradH }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-8 rounded-t-md"
          style={{ background: "linear-gradient(to top, #f8717140, #f8717115)" }}
        />
        <span className="text-[10px] font-mono text-white/30">{roi.traditionalHours}h</span>
      </div>
    </div>
  );
}

/* ── Phase Progress Dots ─────────────────────────────────────── */

function PhaseDots({ phases }: { phases?: import("@/lib/store").PhaseState[] }) {
  if (!phases) return null;
  return (
    <div className="flex gap-1.5">
      {phases.map((p) => (
        <div
          key={p.id}
          title={`${p.name}: ${p.status}`}
          className={`w-2 h-2 rounded-full ${
            p.status === "passed"
              ? "bg-[#4ade80]"
              : p.status === "active"
                ? "bg-[#FF6B2C] animate-pulse"
                : p.status === "failed"
                  ? "bg-[#f87171]"
                  : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

/* ── Severity helpers ────────────────────────────────────────── */

function severityColor(s: string) {
  if (s === "critical") return "#f87171";
  if (s === "success") return "#4ade80";
  return "var(--text-muted)";
}

function severityBg(s: string) {
  if (s === "critical") return "rgba(248,113,113,0.12)";
  if (s === "success") return "rgba(74,222,128,0.10)";
  return "var(--surface-primary)";
}

/* ── Live pulse indicator ──────────────────────────────────── */

function LivePulse() {
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        className="w-2 h-2 rounded-full bg-[var(--accent-green)]"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-[10px] font-mono text-white/30">live</span>
    </div>
  );
}

/* ── Live Audit Entry (appears with animation) ─────────────── */

function LiveAuditEntry({ entry, index, isNew }: { entry: typeof auditTrail[0]; index: number; isNew?: boolean }) {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: -20, backgroundColor: "rgba(255,107,44,0.08)" } : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0)" }}
      transition={isNew ? { duration: 0.5 } : { delay: 0.6 + index * 0.07 }}
      className={`flex items-start gap-3 font-mono text-xs py-1.5 px-2 rounded-lg ${
        entry.severity === "critical" ? "relative" : ""
      }`}
    >
      {/* Pulse overlay for critical */}
      {entry.severity === "critical" && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            boxShadow: [
              "inset 0 0 0px rgba(248,113,113,0)",
              "inset 0 0 20px rgba(248,113,113,0.08)",
              "inset 0 0 0px rgba(248,113,113,0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Time */}
      <span className="text-white/15 tabular-nums shrink-0 w-10">{entry.time}</span>

      {/* Event badge */}
      <span
        className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold"
        style={{
          color: severityColor(entry.severity),
          background: severityBg(entry.severity),
          border: `1px solid ${severityColor(entry.severity)}20`,
        }}
      >
        {entry.severity === "critical" && <AlertTriangle size={9} className="inline mr-1 -mt-0.5" />}
        {entry.event}
      </span>

      {/* Story key */}
      <span className="text-[#FF6B2C]/60 shrink-0">{entry.story}</span>

      {/* Detail */}
      <span
        className="truncate"
        style={{ color: severityColor(entry.severity) }}
      >
        {entry.detail}
      </span>

      {/* New indicator */}
      {isNew && (
        <motion.div
          className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF6B2C] mt-1"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: 4 }}
        />
      )}
    </motion.div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export function CockpitView() {
  const { state, dispatch } = useApp();
  const [liveAudit, setLiveAudit] = useState(auditTrail);
  const [liveTokens, setLiveTokens] = useState(0);
  const [liveCost, setLiveCost] = useState(0);

  const allStories = state.stories;
  const inSymphony = allStories.filter((s) => s.status === "in_symphony");
  const done = allStories.filter((s) => s.status === "done");
  const remaining = allStories.filter((s) => s.status === "ready" || s.status === "backlog");
  const totalCost = costBreakdown.reduce((a, r) => a + r.cost, 0);
  const totalTokens = costBreakdown.reduce((a, r) => a + r.tokens, 0);

  // Compute live sprint metrics from actual story state
  const computedSprint = {
    ...sprint,
    storiesTotal: allStories.length,
    storiesCompleted: done.length,
    storiesInSymphony: inSymphony.length,
    storiesRemaining: remaining.length,
  };

  // Simulate live token/cost updates (bounded)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTokens((prev) => {
        const next = prev + Math.floor(Math.random() * 200 + 50);
        return Math.min(next, 5000000); // Cap at 5M tokens
      });
      setLiveCost((prev) => {
        const next = prev + Math.random() * 0.003;
        return Math.min(next, roi.symphonyCost); // Cap at total budget
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Add live audit entries periodically
  useEffect(() => {
    const liveEntries = [
      { time: "now", event: "Token batch", story: "NCP-1252", detail: "Agent Engineer: 1,240 tokens processed", severity: "info" },
      { time: "now", event: "MCP call", story: "NCP-1252", detail: "GitHub MCP: git push to feature/ncp-1252-rbac", severity: "info" },
      { time: "now", event: "Quality check", story: "NCP-1252", detail: "Code Auditor: tenant isolation verified ✓", severity: "success" },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < liveEntries.length) {
        setLiveAudit((prev) => {
          if (prev.length >= 10 + auditTrail.length) return prev; // Stop injecting after 10 live entries
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
          return [{ ...liveEntries[idx], time: timeStr }, ...prev];
        });
        idx++;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  function goToStory(storyId: string) {
    dispatch({ type: "SET_ACTIVE_STORY", storyId });
    dispatch({ type: "SET_VIEW", view: "session" });
  }

  return (
    <motion.div
      variants={stagger.container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* ── Header ────────────────────────────────────────────── */}
      <motion.div variants={stagger.item} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eye size={14} className="text-[var(--accent-cyan)]" />
            <span className="text-[10px] font-mono text-white/25 uppercase tracking-[0.3em]">
              Executive Cockpit
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white/90">Cockpit</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white/25">
            {sprint.name} &middot; {sprint.startDate} &rarr; {sprint.endDate}
          </span>
          <div className="flex items-center gap-1.5 glass-subtle px-3 py-1.5 rounded-full">
            <LivePulse />
            <span className="text-[11px] font-mono text-white/40">
              {computedSprint.storiesInSymphony} active
            </span>
          </div>

          {/* Live token counter */}
          <motion.div
            className="flex items-center gap-1.5 glass-subtle px-3 py-1.5 rounded-full"
            animate={{ borderColor: ["rgba(255,255,255,0.06)", "rgba(255,107,44,0.2)", "rgba(255,255,255,0.06)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Terminal size={11} className="text-[#FF6B2C]" />
            <span className="text-[11px] font-mono text-[#FF6B2C] tabular-nums">
              +{(liveTokens / 1000).toFixed(1)}k tokens
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
         1. ROI HERO CARD
         ══════════════════════════════════════════════════════════ */}
      <motion.div
        variants={stagger.item}
        whileHover={{ scale: 1.005 }}
        className="glass-card relative overflow-hidden p-8"
        style={{
          boxShadow: "0 0 60px rgba(74,222,128,0.08), inset 0 1px 0 rgba(74,222,128,0.08)",
        }}
      >
        {/* green ambient glow */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-[100px] bg-[#4ade80] opacity-[0.06] pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full blur-[80px] bg-[#4ade80] opacity-[0.04] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left label */}
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-[#4ade80]" />
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                {sprint.name} ROI
              </span>
            </div>
            <p className="text-xs text-white/25 max-w-[180px]">
              Symphony vs traditional dev team delivery across {computedSprint.storiesCompleted} completed stories
            </p>
          </div>

          {/* Center numbers */}
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-8 mb-3">
              {/* Symphony side */}
              <div>
                <div className="text-[10px] font-mono text-[#4ade80]/60 uppercase tracking-wider mb-1">
                  Symphony
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white/90 tabular-nums">
                  <AnimatedCounter target={roi.symphonyHours} suffix=" hours" />
                </div>
                <div className="text-lg font-mono text-[#4ade80] tabular-nums">
                  $<AnimatedCounter target={roi.symphonyCost} decimals={2} />
                </div>
              </div>

              {/* Divider */}
              <div className="flex flex-col items-center gap-1 text-white/15">
                <span className="text-[9px] font-mono">vs</span>
                <div className="w-px h-8 bg-white/10" />
              </div>

              {/* Traditional side */}
              <div>
                <div className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1">
                  Traditional
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white/30 tabular-nums line-through decoration-white/10">
                  <AnimatedCounter target={roi.traditionalHours} suffix=" hours" />
                </div>
                <div className="text-lg font-mono text-white/20 tabular-nums line-through decoration-white/10">
                  $<AnimatedCounter target={roi.traditionalCost} />
                </div>
              </div>
            </div>

            {/* Savings badges */}
            <div className="flex items-center justify-center gap-3">
              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(74,222,128,0)",
                    "0 0 12px rgba(74,222,128,0.3)",
                    "0 0 0px rgba(74,222,128,0)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-mono font-semibold"
                style={{
                  color: "#4ade80",
                  background: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.15)",
                }}
              >
                <Zap size={12} />
                <AnimatedCounter target={roi.timeSavedPct} suffix="% time saved" />
              </motion.span>
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-mono font-semibold"
                style={{
                  color: "#4ade80",
                  background: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.15)",
                }}
              >
                <DollarSign size={12} />
                <AnimatedCounter target={roi.costSavedPct} suffix="% cost saved" />
              </span>
            </div>
          </div>

          {/* Right bar chart */}
          <div className="shrink-0 hidden md:block">
            <RoiBarChart />
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
         2. METRICS ROW (4 cards)
         ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stories Completed */}
        <motion.div variants={stagger.item} className="glass-card p-5 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-3xl bg-[#FF6B2C] opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={14} className="text-[#FF6B2C]" />
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono">
                Stories
              </span>
            </div>
            <div className="text-2xl font-bold text-white/90 tabular-nums mb-2">
              <AnimatedCounter target={computedSprint.storiesCompleted} />
              <span className="text-sm text-white/25 font-normal">/{computedSprint.storiesTotal}</span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${computedSprint.storiesTotal > 0 ? (computedSprint.storiesCompleted / computedSprint.storiesTotal) * 100 : 0}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-[#FF6B2C]"
              />
            </div>
          </div>
        </motion.div>

        {/* Avg Tollgate Score */}
        <motion.div variants={stagger.item} className="glass-card p-5 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-3xl bg-[#4ade80] opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={14} className="text-[#4ade80]" />
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono">
                Tollgate Avg
              </span>
            </div>
            <motion.div
              className="text-2xl font-bold tabular-nums"
              style={{ color: "#4ade80" }}
              animate={{
                textShadow: [
                  "0 0 0px rgba(74,222,128,0)",
                  "0 0 16px rgba(74,222,128,0.3)",
                  "0 0 0px rgba(74,222,128,0)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <AnimatedCounter target={quality.avgTollgateScore} decimals={1} suffix="%" />
            </motion.div>
          </div>
        </motion.div>

        {/* Security Issues Caught */}
        <motion.div variants={stagger.item} className="glass-card p-5 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-3xl bg-[#f87171] opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={14} className="text-[#f87171]" />
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono">
                Security Caught
              </span>
            </div>
            <div className="text-2xl font-bold text-white/90 tabular-nums">
              <AnimatedCounter target={quality.securityIssuesCaught} />
            </div>
            <div className="text-[10px] text-white/20 font-mono mt-1">by Code Auditor</div>
          </div>
        </motion.div>

        {/* Overrides */}
        <motion.div variants={stagger.item} className="glass-card p-5 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-3xl bg-[#f59e0b] opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-[#f59e0b]" />
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono">
                Overrides
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-[#f59e0b] tabular-nums">
                <AnimatedCounter target={quality.overrides} />
              </div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[#f59e0b]"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
         3 + 4. STORIES GRID + COST BREAKDOWN (2-column)
         ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Active Stories ─────────────────────────────────── */}
        <motion.div variants={stagger.item} className="glass-card p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={14} className="text-[var(--accent-cyan)]" />
            <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Active Stories
            </h2>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/20">
                {inSymphony.length} in progress
              </span>
              <LivePulse />
            </div>
          </div>

          <div className="space-y-3">
            {inSymphony.map((story) => {
              const currentPhase = story.phases?.find((p) => p.status === "active") ||
                story.phases?.find((p) => p.status === "failed");
              return (
                <motion.button
                  key={story.id}
                  whileHover={{ x: 4, backgroundColor: "var(--surface-secondary)" }}
                  onClick={() => goToStory(story.id)}
                  className="w-full text-left glass-subtle p-4 flex items-center gap-3 transition-colors cursor-pointer group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[#FF6B2C]">{story.key}</span>
                      {story.priority === "critical" && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20">
                          critical
                        </span>
                      )}
                      {/* Live activity indicator */}
                      <motion.span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/20 flex items-center gap-1"
                        animate={{ borderColor: ["rgba(255,107,44,0.2)", "rgba(255,107,44,0.5)", "rgba(255,107,44,0.2)"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CircleDot size={7} />
                        live
                      </motion.span>
                    </div>
                    <div className="text-sm text-white/70 truncate">{story.title}</div>
                    <div className="flex items-center gap-3 mt-2">
                      {currentPhase && (
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                          style={{
                            color: currentPhase.status === "failed" ? "#f87171" : "#FF6B2C",
                            background:
                              currentPhase.status === "failed"
                                ? "rgba(248,113,113,0.10)"
                                : "rgba(255,107,44,0.10)",
                            border: `1px solid ${currentPhase.status === "failed" ? "rgba(248,113,113,0.20)" : "rgba(255,107,44,0.20)"}`,
                          }}
                        >
                          {currentPhase.name}
                          {currentPhase.status === "failed" ? " (blocked)" : ""}
                        </span>
                      )}
                      <PhaseDots phases={story.phases} />
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-white/10 group-hover:text-white/30 transition-colors shrink-0"
                  />
                </motion.button>
              );
            })}

            {/* Recently completed */}
            {done.length > 0 && (
              <>
                <div className="text-[10px] font-mono text-white/15 uppercase tracking-wider pt-2">
                  Recently completed
                </div>
                {done.slice(0, 3).map((story) => (
                  <motion.button
                    key={story.id}
                    whileHover={{ x: 4, opacity: 0.8 }}
                    onClick={() => {
                      dispatch({ type: "SET_ACTIVE_STORY", storyId: story.id });
                      dispatch({ type: "SET_VIEW", view: "tollgate" });
                    }}
                    className="w-full text-left glass-subtle p-3 flex items-center gap-3 opacity-50 cursor-pointer group"
                  >
                    <CheckCircle size={14} className="text-[#4ade80] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/20">{story.key}</span>
                        <span className="text-xs text-white/30 truncate">{story.title}</span>
                      </div>
                    </div>
                    <ArrowRight
                      size={12}
                      className="text-white/0 group-hover:text-white/30 transition-colors shrink-0"
                    />
                  </motion.button>
                ))}
              </>
            )}

            {inSymphony.length === 0 && done.length === 0 && (
              <div className="text-center py-8 text-white/15 text-sm font-mono">
                No stories in Symphony yet
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Cost Breakdown ─────────────────────────────────── */}
        <motion.div variants={stagger.item} className="glass-card p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-5">
            <DollarSign size={14} className="text-[#f59e0b]" />
            <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Cost Breakdown
            </h2>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#f59e0b]">
                ${(totalCost + liveCost).toFixed(2)} total
              </span>
              <motion.span
                className="text-[9px] font-mono text-white/20"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                +${liveCost.toFixed(3)}
              </motion.span>
            </div>
          </div>

          {/* Table header */}
          <div className="flex items-center gap-2 px-3 mb-2 text-[9px] font-mono text-white/20 uppercase tracking-wider">
            <div className="flex-1">Role</div>
            <div className="w-16 text-right">Cost</div>
            <div className="w-16 text-right">Tokens</div>
            <div className="w-14 text-right">Model</div>
          </div>

          <div className="space-y-1.5">
            {costBreakdown.map((row, i) => (
              <motion.div
                key={row.role}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="flex items-center gap-2 glass-subtle px-3 py-2.5 text-xs"
              >
                <div className="flex-1 font-mono text-white/60">{row.role}</div>
                <div className="w-16 text-right font-mono text-[#f59e0b] font-semibold tabular-nums">
                  ${row.cost.toFixed(2)}
                </div>
                <div className="w-16 text-right font-mono text-white/30 tabular-nums">
                  {(row.tokens / 1000).toFixed(0)}k
                </div>
                <div className="w-14 text-right font-mono text-white/30 tabular-nums">
                  {row.model.split(" ").pop()}
                </div>
              </motion.div>
            ))}

            {/* Total row */}
            <div className="flex items-center gap-2 px-3 py-2.5 text-xs border-t border-white/5 mt-2">
              <div className="flex-1 font-mono text-white/40 font-semibold">Total</div>
              <div className="w-16 text-right font-mono text-[#f59e0b] font-bold tabular-nums">
                ${(totalCost + liveCost).toFixed(2)}
              </div>
              <div className="w-16 text-right font-mono text-white/40 tabular-nums">
                {((totalTokens + liveTokens) / 1000).toFixed(0)}k
              </div>
              <div className="w-14" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
         5. AUDIT TRAIL + 6. QUALITY TRENDS (full width)
         ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── Audit Trail (2/3 width) ────────────────────────── */}
        <motion.div
          variants={stagger.item}
          className="md:col-span-2 glass-card p-6 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={14} className="text-[var(--accent-purple)]" />
            <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Audit Trail
            </h2>
            <div className="ml-auto">
              <LivePulse />
            </div>
          </div>

          <div className="space-y-1">
            <AnimatePresence>
              {liveAudit.map((entry, i) => (
                <LiveAuditEntry
                  key={`${entry.time}-${entry.event}-${i}`}
                  entry={entry}
                  index={i}
                  isNew={entry.time === "now" || i < (liveAudit.length - auditTrail.length)}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Quality Trends (1/3 width) ─────────────────────── */}
        <motion.div variants={stagger.item} className="glass-card p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] bg-[#4ade80] opacity-[0.05] pointer-events-none" />

          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={14} className="text-[#4ade80]" />
            <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Quality Trends
            </h2>
          </div>

          {/* Sparkline bars — derived from actual tollgate scores + historical padding */}
          {(() => {
            const scores: number[] = [];
            state.stories.forEach(s => {
              s.phases?.forEach(p => {
                if (p.tollgate?.overallScore) scores.push(p.tollgate.overallScore);
              });
            });
            // Pad with historical data if we don't have enough
            const historical = [78, 82, 80, 88, 85, 90, 87];
            const qualityData = [...historical, ...scores].slice(-10);
            return (
          <div className="flex items-end gap-1.5 h-[80px] mb-4">
            {qualityData.map((v, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${v}%` }}
                transition={{ delay: 0.7 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 rounded-t-sm relative group cursor-pointer"
                style={{
                  background:
                    i === qualityData.length - 1
                      ? "linear-gradient(to top, #4ade80, #4ade8060)"
                      : "linear-gradient(to top, var(--surface-hover), var(--surface-secondary))",
                }}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white/0 group-hover:text-white/60 transition-colors bg-black/60 px-1 rounded">
                  {v}%
                </div>
              </motion.div>
            ))}
          </div>
            );
          })()}

          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={12} className="text-[#4ade80]" />
            <span className="text-sm font-mono text-[#4ade80]">Trending up</span>
          </div>
          <div className="text-xs text-white/30 font-mono">
            {quality.tollgatePassRate}% pass rate this sprint
          </div>
          <div className="text-[10px] text-white/15 font-mono mt-1">
            Avg score: {quality.avgTollgateScore}% across all gates
          </div>

          {/* Live activity feed */}
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-2">Live Activity</div>
            <div className="space-y-1.5">
              {[
                { agent: "Agent Engineer", action: "Writing tests", color: "#FF6B2C" },
                { agent: "Code Auditor", action: "Security scan", color: "#f87171" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 text-[10px] font-mono"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: item.color }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                  />
                  <span style={{ color: item.color }}>{item.agent}</span>
                  <span className="text-white/25">{item.action}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CockpitView;
