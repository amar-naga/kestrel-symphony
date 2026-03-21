"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import {
  Brain,
  ChevronRight,
  DollarSign,
  Clock,
  Users,
  Wrench,
  Check,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  FileText,
  Cpu,
  ShieldCheck,
  Activity,
  ClipboardCheck,
  Database,
  Palette,
  Network,
} from "lucide-react";
import type { BlueprintPhase, HumanMode } from "@/lib/store";
import { ROLE_CATALOG } from "@/lib/sample-data";

/* ================================================================
   HELPERS
   ================================================================ */

const roleIconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  "Requirements Dev": FileText,
  "Process Leader": ClipboardCheck,
  "Data Steward": Database,
  "Agent Engineer": Cpu,
  "Code Auditor": ShieldCheck,
  "UX Designer": Palette,
  Architect: Network,
  "Agent Ops": Activity,
};

function getRoleColor(roleName: string): string {
  const entry = ROLE_CATALOG.find((r) => r.id === roleName);
  return entry?.color ?? "#888";
}

function RoleChip({ name }: { name: string }) {
  const Icon = roleIconMap[name];
  const color = getRoleColor(name);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {Icon && <Icon size={12} />}
      {name}
    </span>
  );
}

function ToolBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-white/50 border border-white/10">
      <Wrench size={10} />
      {name}
    </span>
  );
}

const humanModeConfig: Record<HumanMode, { label: string; color: string; bg: string }> = {
  collaborative: { label: "Collaborative", color: "#4361ee", bg: "#4361ee18" },
  review: { label: "Review", color: "#f59e0b", bg: "#f59e0b18" },
  delegated: { label: "Delegated", color: "#00c896", bg: "#00c89618" },
};

const phaseAccents: Record<string, string> = {
  plan: "#4361ee",
  design: "#7b2ff7",
  build: "#f59e0b",
  deploy: "#00c896",
};

/* ================================================================
   PHASE CARD
   ================================================================ */

function PhaseCard({ phase, index, total }: { phase: BlueprintPhase; index: number; total: number }) {
  const accent = phaseAccents[phase.id] ?? "#4361ee";
  const mode = humanModeConfig[phase.humanMode];

  return (
    <motion.div
      className="flex items-center gap-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.12, duration: 0.5 }}
    >
      <div
        className="relative flex-1 min-w-[220px] rounded-xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderLeft: `3px solid ${accent}`,
        }}
      >
        {/* Phase header */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <span
            className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold"
            style={{ background: `${accent}25`, color: accent }}
          >
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-white/90">{phase.name}</span>
          <span
            className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: mode.bg, color: mode.color, border: `1px solid ${mode.color}30` }}
          >
            {mode.label}
          </span>
        </div>

        {/* Roles */}
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {phase.roles.map((r) => (
            <RoleChip key={r} name={r} />
          ))}
        </div>

        {/* Tools */}
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {phase.tools.map((t) => (
            <ToolBadge key={t} name={t} />
          ))}
        </div>

        {/* Estimates */}
        <div className="px-4 pb-4 flex items-center gap-4 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {phase.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={12} />
            ${phase.estimatedCost.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Connector arrow between phases */}
      {index < total - 1 && (
        <div className="flex-shrink-0 flex items-center px-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.12 }}
          >
            <ChevronRight size={20} className="text-white/20" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/* ================================================================
   TYPE / PRIORITY BADGES
   ================================================================ */

const typeBadgeColors: Record<string, string> = {
  feature: "#4361ee",
  bug: "#e63946",
  spike: "#f59e0b",
  epic: "#7b2ff7",
};

const priorityBadgeColors: Record<string, string> = {
  critical: "#e63946",
  high: "#f59e0b",
  medium: "#4361ee",
  low: "#888",
};

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export function BlueprintView() {
  const { state, dispatch } = useApp();

  const story = state.stories.find((s) => s.id === state.activeStoryId);
  const blueprint = story?.blueprint;

  /* ── Empty state ─────────────────────────────────────── */
  if (!story || !blueprint) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Brain size={48} className="mx-auto mb-4 text-white/20" />
          <p className="text-white/40 text-lg">Select a story from the Board to see its Blueprint</p>
        </motion.div>
      </div>
    );
  }

  /* ── Derived values ──────────────────────────────────── */
  const traditionalHours = blueprint.historicalComparison.avgDevHours;
  const traditionalCost = blueprint.historicalComparison.avgCost;
  const symphonyHours = blueprint.totalEstimatedMinutes / 60;
  const symphonyCost = blueprint.totalEstimatedCost;
  const timeSavedPct = Math.round((1 - symphonyHours / traditionalHours) * 100);
  const costSavedPct = traditionalCost > 0 ? Math.round((1 - symphonyCost / traditionalCost) * 100) : 0;

  const typeColor = typeBadgeColors[story.type] ?? "#888";
  const priorityColor = priorityBadgeColors[story.priority] ?? "#888";

  /* ── Handlers ────────────────────────────────────────── */
  function handleApprove() {
    dispatch({ type: "APPROVE_BLUEPRINT", storyId: story!.id });
    // Start first phase
    const firstPhase = blueprint!.phases[0];
    if (firstPhase) {
      dispatch({ type: "START_PHASE", storyId: story!.id, phaseId: firstPhase.id });
      dispatch({ type: "SET_ACTIVE_PHASE", phaseId: firstPhase.id });
    }
    dispatch({ type: "SET_VIEW", view: "session" });
  }

  function handleReject() {
    dispatch({ type: "SET_ACTIVE_STORY", storyId: null });
    dispatch({ type: "SET_VIEW", view: "board" });
  }

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full space-y-6">
      {/* ─── 1. Story Header ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back link */}
        <button
          onClick={() => dispatch({ type: "SET_VIEW", view: "board" })}
          className="text-xs text-white/30 hover:text-white/60 transition-colors mb-3 flex items-center gap-1"
        >
          <ChevronRight size={12} className="rotate-180" />
          Back to Board
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-white/90 tracking-tight">
            <span className="text-white/40 font-mono mr-2">{story.key}</span>
            {story.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {/* Type badge */}
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{ background: `${typeColor}20`, color: typeColor, border: `1px solid ${typeColor}30` }}
          >
            {story.type}
          </span>
          {/* Priority badge */}
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{ background: `${priorityColor}20`, color: priorityColor, border: `1px solid ${priorityColor}30` }}
          >
            {story.priority}
          </span>
          {/* Component */}
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10 font-mono">
            {story.component}
          </span>
          {/* Story points */}
          {story.storyPoints && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
              {story.storyPoints} pts
            </span>
          )}
        </div>
      </motion.div>

      {/* ─── 2. AI Reasoning Block ──────────────────────── */}
      <motion.div
        className="relative rounded-2xl p-[1px] overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(67,97,238,0.4), rgba(123,47,247,0.4), rgba(0,212,255,0.3))",
          }}
        />
        {/* Inner card */}
        <div
          className="relative rounded-2xl px-6 py-5"
          style={{
            background: "rgba(10,10,20,0.85)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: "linear-gradient(135deg, #4361ee30, #7b2ff730)" }}
            >
              <Sparkles size={18} className="text-[#7b2ff7]" />
            </div>
            <h2 className="text-base font-semibold text-white/90">Symphony Analysis</h2>
          </div>

          <p className="text-sm text-white/60 leading-relaxed mb-3">{blueprint.reasoning}</p>

          {/* Similar story references */}
          {blueprint.historicalComparison.similarStories.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Brain size={13} />
              <span>
                Based on{" "}
                {blueprint.historicalComparison.similarStories.map((ref, i) => (
                  <span key={ref}>
                    {i > 0 && ", "}
                    <span className="text-white/50 font-mono">{ref}</span>
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── 3. Phase Cards ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Users size={13} />
          Execution Phases
        </h3>
        <div className="flex flex-wrap items-stretch gap-0">
          {blueprint.phases.map((phase, i) => (
            <PhaseCard key={phase.id} phase={phase} index={i} total={blueprint.phases.length} />
          ))}
        </div>
      </motion.div>

      {/* ─── 4. Cost Comparison Panel ───────────────────── */}
      <motion.div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {/* Symphony side */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#00c896]" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">With Symphony</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-[#00c896]" />
                <span className="text-2xl font-bold text-white/90">${symphonyCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#00c896]" />
                <span className="text-sm text-white/50">{blueprint.totalEstimatedMinutes} minutes</span>
              </div>
            </div>
          </div>

          {/* Traditional side */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Traditional (vendors)</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-white/30" />
                <span className="text-2xl font-bold text-white/40">${traditionalCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-white/30" />
                <span className="text-sm text-white/30">{traditionalHours} hours avg</span>
              </div>
            </div>
          </div>

          {/* Savings */}
          <div className="px-6 py-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#4361ee]" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Savings</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-white/60">
                <span className="text-[#00c896] font-bold text-lg">{timeSavedPct}%</span>
                <span className="ml-1">faster</span>
              </p>
              <p className="text-sm text-white/60">
                <span className="text-[#00c896] font-bold text-lg">{costSavedPct}%</span>
                <span className="ml-1">cost reduction</span>
              </p>
            </div>
            {/* Similar stories */}
            <div className="mt-3 text-[11px] text-white/25">
              Similar: {blueprint.historicalComparison.similarStories.join(", ")}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── 5. Action Buttons ──────────────────────────── */}
      <motion.div
        className="flex items-center gap-3 pt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        {/* Approve */}
        <motion.button
          onClick={handleApprove}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #00c896, #00a87a)",
            boxShadow: "0 0 20px rgba(0,200,150,0.25)",
          }}
          whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(0,200,150,0.4)" }}
          whileTap={{ scale: 0.97 }}
        >
          <Check size={16} />
          Approve Blueprint
          <ArrowRight size={14} />
        </motion.button>

        {/* Adjust */}
        <motion.button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/60 transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          whileHover={{ background: "rgba(255,255,255,0.08)" }}
          whileTap={{ scale: 0.97 }}
        >
          <AlertTriangle size={14} />
          Adjust
        </motion.button>

        {/* Reject */}
        <button
          onClick={handleReject}
          className="ml-auto text-xs text-red-400/50 hover:text-red-400/80 transition-colors"
        >
          Reject
        </button>
      </motion.div>
    </div>
  );
}

export default BlueprintView;
