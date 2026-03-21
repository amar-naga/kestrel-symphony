"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowLeftRight,
  Settings,
  X,
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
  collaborative: { label: "Collaborative", color: "#FF6B2C", bg: "#FF6B2C18" },
  review: { label: "Review", color: "#fbbf24", bg: "#fbbf2418" },
  delegated: { label: "Delegated", color: "#4ade80", bg: "#4ade8018" },
};

const humanModeDescriptions: Record<HumanMode, string> = {
  collaborative: "Human works alongside agents in real-time",
  review: "Agents work autonomously, human reviews output",
  delegated: "Fully autonomous \u2014 agents handle end-to-end",
};

const phaseAccents: Record<string, string> = {
  plan: "#FF6B2C",
  design: "#999999",
  build: "#FF8F5C",
  deploy: "#666666",
};

/* ================================================================
   PHASE CARD
   ================================================================ */

function PhaseCard({ phase, index, total }: { phase: BlueprintPhase; index: number; total: number }) {
  const accent = phaseAccents[phase.id] ?? "#FF6B2C";
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
          background: "var(--surface-secondary)",
          backdropFilter: "blur(16px)",
          border: "1px solid var(--border-primary)",
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
          <div className="ml-auto text-right">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: mode.bg, color: mode.color, border: `1px solid ${mode.color}30` }}
            >
              {mode.label}
            </span>
            <p className="text-[10px] mt-0.5" style={{ color: `${mode.color}80` }}>
              {humanModeDescriptions[phase.humanMode]}
            </p>
          </div>
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
  feature: "#FF6B2C",
  bug: "#f87171",
  spike: "#fbbf24",
  epic: "#FF8F5C",
};

const priorityBadgeColors: Record<string, string> = {
  critical: "#f87171",
  high: "#fbbf24",
  medium: "#FF6B2C",
  low: "#888",
};

/* ================================================================
   PROVISIONING STEPS (loading overlay after Approve)
   ================================================================ */

function ProvisioningSteps() {
  const [step, setStep] = useState(0);
  const steps = [
    "Provisioning agent roles...",
    "Connecting MCP tools (GitHub, Jira, Confluence)...",
    "Loading context from knowledge repository...",
    "Applying guardrails (token budget, cost cap, PII filter)...",
    "Phase 1 ready \u2014 entering session...",
  ];
  useEffect(() => {
    const timers = steps.map((_, i) => setTimeout(() => setStep(i), i * 450));
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="space-y-1.5">
      {steps.map((s, i) => (
        <motion.p key={i} className="text-xs font-mono"
          initial={{ opacity: 0, x: -10 }}
          animate={i <= step ? { opacity: 1, x: 0 } : {}}
          style={{ color: i < step ? "#4ade80" : i === step ? "var(--text-secondary)" : "transparent" }}
        >
          {i < step ? "\u2713 " : i === step ? "\u23F3 " : ""}{s}
        </motion.p>
      ))}
    </div>
  );
}

/* ================================================================
   ADJUST PANEL (config panel for tuning blueprint)
   ================================================================ */

function AdjustPanel({ phases, onClose }: { phases: BlueprintPhase[]; onClose: () => void }) {
  const [saved, setSaved] = useState(false);
  const llmOptions = ["Claude Opus 4.6", "Claude Sonnet 4", "Claude Haiku 4.5"];
  const humanModes: HumanMode[] = ["collaborative", "review", "delegated"];

  const modelMap: Record<string, string> = {
    "Requirements Dev": "Claude Opus 4.6",
    "Process Leader": "Claude Sonnet 4",
    "Data Steward": "Claude Sonnet 4",
    "Agent Engineer": "Claude Opus 4.6",
    "Code Auditor": "Claude Sonnet 4",
    "UX Designer": "Claude Sonnet 4",
    Architect: "Claude Opus 4.6",
    "Agent Ops": "Claude Haiku 4.5",
  };

  function handleSave() {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  }

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--surface-secondary)",
        border: "1px solid var(--border-primary)",
        backdropFilter: "blur(16px)",
      }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <Settings size={14} className="text-white/40" />
          <span className="text-sm font-semibold text-white/80">Adjust Configuration</span>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Phase columns grid */}
      <div className="px-5 pb-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${phases.length}, 1fr)` }}>
          {phases.map((phase) => {
            const accent = phaseAccents[phase.id] ?? "#FF6B2C";
            return (
              <div key={phase.id} className="space-y-3">
                {/* Phase name */}
                <div className="flex items-center gap-2 pb-2" style={{ borderBottom: `2px solid ${accent}40` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
                    {phase.name}
                  </span>
                </div>

                {/* Roles toggles */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-white/30 block mb-1.5">Roles</label>
                  <div className="space-y-1">
                    {ROLE_CATALOG.map((role) => {
                      const isActive = phase.roles.includes(role.id);
                      return (
                        <label key={role.id} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            defaultChecked={isActive}
                            className="w-3 h-3 rounded accent-[#FF6B2C]"
                          />
                          <span className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors">
                            {role.id}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* LLM model per role */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-white/30 block mb-1.5">LLM Model</label>
                  <div className="space-y-1">
                    {phase.roles.map((role) => (
                      <div key={role} className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40 w-20 truncate">{role}</span>
                        <select
                          defaultValue={modelMap[role] ?? "Claude Sonnet 4"}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60 border border-white/10 cursor-pointer"
                          style={{ outline: "none" }}
                        >
                          {llmOptions.map((opt) => (
                            <option key={opt} value={opt} style={{ background: "#1a1a1a" }}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Human mode */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-white/30 block mb-1.5">Human Mode</label>
                  <div className="space-y-1">
                    {humanModes.map((hm) => {
                      const cfg = humanModeConfig[hm];
                      return (
                        <label key={hm} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`humanMode-${phase.id}`}
                            defaultChecked={phase.humanMode === hm}
                            className="w-3 h-3 accent-[#FF6B2C]"
                          />
                          <span className="text-[11px]" style={{ color: cfg.color }}>
                            {cfg.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Budget ceiling */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-white/30 block mb-1.5">Budget Cap ($)</label>
                  <input
                    type="number"
                    defaultValue={Math.round(phase.estimatedCost * 2)}
                    className="w-full text-[11px] px-2 py-1 rounded bg-white/5 text-white/60 border border-white/10"
                    style={{ outline: "none" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3 mt-4 pt-3" style={{ borderTop: "1px solid var(--border-secondary)" }}>
          <motion.button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
            style={{
              background: saved ? "#4ade80" : "linear-gradient(135deg, #FF6B2C, #CC5623)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {saved ? (
              <>
                <Check size={14} />
                Saved!
              </>
            ) : (
              <>
                <Check size={14} />
                Save Changes
              </>
            )}
          </motion.button>
          <button
            onClick={onClose}
            className="text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export function BlueprintView() {
  const { state, dispatch } = useApp();

  const [adjustOpen, setAdjustOpen] = useState(false);
  const [provisioning, setProvisioning] = useState(false);

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
    setProvisioning(true);
    dispatch({ type: "APPROVE_BLUEPRINT", storyId: story!.id });
    const firstPhase = blueprint!.phases[0];
    if (firstPhase) {
      dispatch({ type: "START_PHASE", storyId: story!.id, phaseId: firstPhase.id });
      dispatch({ type: "SET_ACTIVE_PHASE", phaseId: firstPhase.id });
    }
    setTimeout(() => {
      dispatch({ type: "SET_VIEW", view: "session" });
      setProvisioning(false);
    }, 2500);
  }

  function handleReject() {
    dispatch({ type: "SET_ACTIVE_STORY", storyId: null });
    dispatch({ type: "SET_VIEW", view: "board" });
  }

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Provisioning overlay */}
      {provisioning && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div className="text-center space-y-4" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <motion.div
              className="w-12 h-12 mx-auto rounded-full border-2 border-t-transparent"
              style={{ borderColor: "#FF6B2C", borderTopColor: "transparent" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <ProvisioningSteps />
          </motion.div>
        </motion.div>
      )}

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
            background: "linear-gradient(135deg, rgba(255,107,44,0.4), rgba(255,143,92,0.3), rgba(200,200,200,0.2))",
          }}
        />
        {/* Inner card */}
        <div
          className="relative rounded-2xl px-6 py-5"
          style={{
            background: "var(--panel-bg)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: "linear-gradient(135deg, #FF6B2C30, #FF8F5C30)" }}
            >
              <Sparkles size={18} className="text-[#FF6B2C]" />
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

      {/* ─── 3a. Adjust Config Panel ─────────────────── */}
      <AnimatePresence>
        {adjustOpen && (
          <AdjustPanel phases={blueprint.phases} onClose={() => setAdjustOpen(false)} />
        )}
      </AnimatePresence>

      {/* ─── 3b. Agent Configuration ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.5 }}
      >
        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Cpu size={13} />
          Agent Configuration
        </h3>

        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--surface-secondary)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="p-5">
            <div className="space-y-4">
              {(() => {
                const roleConfigs: { role: string; model: string; tools: string[]; description: string; phase: string }[] = [];
                const modelMap: Record<string, string> = {
                  "Requirements Dev": "Claude Opus 4.6",
                  "Process Leader": "Claude Sonnet 4",
                  "Data Steward": "Claude Sonnet 4",
                  "Agent Engineer": "Claude Opus 4.6",
                  "Code Auditor": "Claude Sonnet 4",
                  "UX Designer": "Claude Sonnet 4",
                  Architect: "Claude Opus 4.6",
                  "Agent Ops": "Claude Haiku 4.5",
                };
                const descMap: Record<string, string> = {
                  "Requirements Dev": "Translates business needs into structured specs with acceptance criteria",
                  "Process Leader": "Builds SOPs, edge cases, and approval gates",
                  "Data Steward": "Validates data schemas and quality constraints",
                  "Agent Engineer": "Builds, tests, and validates implementations",
                  "Code Auditor": "Security scanning and code quality review",
                  "UX Designer": "Interface design and usability validation",
                  Architect: "Technical architecture and system design",
                  "Agent Ops": "Deploys, monitors, and manages production",
                };
                const seenRoles = new Set<string>();

                blueprint.phases.forEach((phase) => {
                  phase.roles.forEach((role) => {
                    if (!seenRoles.has(role)) {
                      seenRoles.add(role);
                      roleConfigs.push({
                        role,
                        model: modelMap[role] ?? "Claude Sonnet 4",
                        tools: phase.tools,
                        description: descMap[role] ?? "AI agent role",
                        phase: phase.name,
                      });
                    }
                  });
                });

                const interactions: { from: string; to: string }[] = [];
                blueprint.phases.forEach((phase) => {
                  if (phase.roles.length >= 2) {
                    for (let ri = 0; ri < phase.roles.length; ri++) {
                      for (let rj = ri + 1; rj < phase.roles.length; rj++) {
                        interactions.push({ from: phase.roles[ri], to: phase.roles[rj] });
                      }
                    }
                  }
                });

                const modelColors: Record<string, string> = {
                  "Claude Opus 4.6": "#FF6B2C",
                  "Claude Sonnet 4": "#999999",
                  "Claude Haiku 4.5": "#FF8F5C",
                };

                return (
                  <>
                    {roleConfigs.map((config, idx) => {
                      const roleColor = getRoleColor(config.role);
                      const RoleIcon = roleIconMap[config.role];
                      const modelColor = modelColors[config.model] ?? "#888";

                      return (
                        <motion.div
                          key={config.role}
                          className="rounded-lg p-4"
                          style={{
                            background: "var(--surface-secondary)",
                            border: `1px solid ${roleColor}20`,
                            borderLeft: `3px solid ${roleColor}`,
                          }}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 + idx * 0.08 }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                              style={{ background: `${roleColor}15`, border: `1px solid ${roleColor}30` }}
                            >
                              <div style={{ color: roleColor }}>{RoleIcon ? <RoleIcon size={18} className="opacity-90" /> : <Cpu size={18} />}</div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold" style={{ color: roleColor }}>{config.role}</span>
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: `${modelColor}15`, color: modelColor, border: `1px solid ${modelColor}30` }}
                                >
                                  {config.model}
                                </span>
                              </div>
                              <p className="text-xs text-white/40 mb-2">{config.description}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {config.tools.map((tool) => (
                                  <span key={tool} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/40 border border-white/10">
                                    <Wrench size={9} />
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {interactions.length > 0 && (
                      <motion.div
                        className="mt-2 pt-3"
                        style={{ borderTop: "1px solid var(--border-secondary)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2 block">Agent Interactions</span>
                        <div className="space-y-2">
                          {interactions.map((wire, wi) => {
                            const fromColor = getRoleColor(wire.from);
                            const toColor = getRoleColor(wire.to);
                            return (
                              <div key={wi} className="flex items-center gap-2 text-xs">
                                <span className="font-medium" style={{ color: fromColor }}>{wire.from}</span>
                                <div className="flex-1 flex items-center gap-1">
                                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${fromColor}40, ${toColor}40)` }} />
                                  <ArrowLeftRight size={12} className="text-white/20 shrink-0" />
                                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${toColor}40, ${fromColor}40)` }} />
                                </div>
                                <span className="font-medium" style={{ color: toColor }}>{wire.to}</span>
                                <span className="text-[10px] text-white/20 font-mono">A2A</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── 4. Cost Comparison Panel ───────────────────── */}
      <motion.div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--surface-secondary)",
          backdropFilter: "blur(16px)",
          border: "1px solid var(--border-primary)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {/* Symphony side */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">With Symphony</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-[#4ade80]" />
                <span className="text-2xl font-bold text-white/90">${symphonyCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#4ade80]" />
                <span className="text-sm text-white/50">{blueprint.totalEstimatedMinutes} minutes</span>
              </div>
            </div>
          </div>

          {/* Traditional side */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Traditional (Dev Team)</span>
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
              <div className="w-2 h-2 rounded-full bg-[#FF6B2C]" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Savings</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-white/60">
                <span className="text-[#4ade80] font-bold text-lg">{timeSavedPct}%</span>
                <span className="ml-1">faster</span>
              </p>
              <p className="text-sm text-white/60">
                <span className="text-[#4ade80] font-bold text-lg">{costSavedPct}%</span>
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
            background: "linear-gradient(135deg, #FF6B2C, #CC5623)",
            boxShadow: "0 0 20px rgba(255,107,44,0.25)",
          }}
          whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(255,107,44,0.4)" }}
          whileTap={{ scale: 0.97 }}
        >
          <Check size={16} />
          Approve Blueprint
          <ArrowRight size={14} />
        </motion.button>

        {/* Adjust */}
        <motion.button
          onClick={() => setAdjustOpen(!adjustOpen)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/60 transition-all"
          style={{
            background: adjustOpen ? "rgba(255,107,44,0.1)" : "var(--surface-primary)",
            border: adjustOpen ? "1px solid rgba(255,107,44,0.3)" : "1px solid var(--border-primary)",
          }}
          whileHover={{ background: "var(--surface-hover)" }}
          whileTap={{ scale: 0.97 }}
        >
          <Settings size={14} />
          {adjustOpen ? "Close Config" : "Adjust"}
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
