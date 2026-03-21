"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Lock,
  Unlock,
  Clock,
  FileText,
  ArrowRight,
  RotateCcw,
  Eye,
} from "lucide-react";
import type { TollgateResult, TollgateCriterion, PhaseState, JiraStory } from "@/lib/store";

/* ================================================================
   HELPERS
   ================================================================ */

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function scoreColor(score: number): string {
  if (score >= 90) return "#00c896";
  if (score >= 75) return "#f59e0b";
  if (score >= 50) return "#f97316";
  return "#e63946";
}

function phaseLabel(id: string): string {
  const map: Record<string, string> = { plan: "Plan", design: "Design", build: "Build", deploy: "Deploy" };
  return map[id] ?? id;
}

/* ================================================================
   SCORE RING (SVG)
   ================================================================ */

function ScoreRing({ score, passed, size = 160 }: { score: number; passed: boolean; size?: number }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = passed ? "#00c896" : "#e63946";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 40px ${color}30, 0 0 80px ${color}15`,
        }}
      />

      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={8}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>

      {/* Center text */}
      <div className="relative flex flex-col items-center gap-1 z-10">
        <motion.span
          className="text-5xl font-black tracking-tight"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: `${color}cc` }}>
          {passed ? "PASSED" : "BLOCKED"}
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   CRITERION CARD
   ================================================================ */

function CriterionCard({ criterion, index }: { criterion: TollgateCriterion; index: number }) {
  const [expanded, setExpanded] = useState(!criterion.passed);
  const barColor = scoreColor(criterion.score);
  const failed = !criterion.passed;

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        border: failed ? "1px solid rgba(230,57,70,0.4)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: failed ? "0 0 20px rgba(230,57,70,0.1)" : "none",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1 }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Pulse animation for failed criteria */}
      {failed && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ border: "1px solid rgba(230,57,70,0.3)" }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {criterion.passed ? (
              <CheckCircle size={20} className="text-emerald-400" />
            ) : (
              <XCircle size={20} className="text-red-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white/90">{criterion.name}</span>
              <span
                className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: `${barColor}18`,
                  color: barColor,
                  border: `1px solid ${barColor}30`,
                }}
              >
                {criterion.score}
              </span>
            </div>
            <p className="text-xs text-white/40 mt-0.5">{criterion.description}</p>

            {/* Score bar */}
            <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: barColor }}
                initial={{ width: 0 }}
                animate={{ width: `${criterion.score}%` }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1, ease: "easeOut" }}
              />
            </div>

            {/* Failure details */}
            <AnimatePresence>
              {expanded && criterion.details && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-3 rounded-lg bg-red-500/8 border border-red-500/15">
                    <p className="text-xs text-red-300 leading-relaxed">{criterion.details}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   OVERRIDE PANEL
   ================================================================ */

function OverridePanel({
  tollgate,
  storyId,
  onOverride,
}: {
  tollgate: TollgateResult;
  storyId: string;
  onOverride: (by: string, justification: string) => void;
}) {
  const [showPanel, setShowPanel] = useState(false);
  const [justification, setJustification] = useState("");
  const [techLead] = useState("Sarah Chen \u2014 Tech Lead");

  if (tollgate.passed || tollgate.override) return null;

  return (
    <div className="mt-6">
      {!showPanel ? (
        <motion.button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: "rgba(230,57,70,0.12)",
            color: "#e63946",
            border: "1px solid rgba(230,57,70,0.25)",
          }}
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(230,57,70,0.15)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPanel(true)}
        >
          <Unlock size={16} />
          Override Tollgate
        </motion.button>
      ) : (
        <motion.div
          className="rounded-xl overflow-hidden"
          style={{
            background: "rgba(230,57,70,0.06)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(230,57,70,0.25)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} className="text-red-400" />
              <span className="text-sm font-bold text-red-300">Tollgate Override</span>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-red-400/60">
                Requires Justification
              </span>
            </div>

            {/* Tech Lead selector */}
            <div className="mb-3">
              <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1 block">
                Authorizing Lead
              </label>
              <div
                className="px-3 py-2 rounded-lg text-sm text-white/80"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {techLead}
              </div>
            </div>

            {/* Justification */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1 block">
                Justification <span className="text-red-400">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 rounded-lg text-sm text-white/90 placeholder:text-white/20 resize-none focus:outline-none focus:ring-1 focus:ring-red-500/40"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                rows={3}
                placeholder="Explain why this tollgate failure is being overridden..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: justification.trim() ? "rgba(230,57,70,0.2)" : "rgba(230,57,70,0.08)",
                  color: "#e63946",
                  border: "1px solid rgba(230,57,70,0.3)",
                }}
                disabled={!justification.trim()}
                whileHover={justification.trim() ? { scale: 1.02 } : {}}
                whileTap={justification.trim() ? { scale: 0.98 } : {}}
                onClick={() => {
                  if (justification.trim()) {
                    onOverride(techLead, justification.trim());
                  }
                }}
              >
                <ShieldCheck size={16} />
                Confirm Override
              </motion.button>
              <button
                className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/60 transition-colors"
                onClick={() => {
                  setShowPanel(false);
                  setJustification("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ================================================================
   OVERRIDE AUDIT BANNER
   ================================================================ */

function OverrideAuditBanner({ tollgate }: { tollgate: TollgateResult }) {
  if (!tollgate.override) return null;

  const failedCriteria = tollgate.criteria.filter((c) => !c.passed);
  const cveMatch = failedCriteria
    .map((c) => c.details ?? "")
    .join(" ")
    .match(/CVE-\d{4}-\d+/);
  const cveId = cveMatch ? cveMatch[0] : null;

  return (
    <motion.div
      className="rounded-xl overflow-hidden mb-6"
      style={{
        background: "rgba(230,57,70,0.08)",
        backdropFilter: "blur(16px)",
        border: "2px solid rgba(230,57,70,0.4)",
        boxShadow: "0 0 30px rgba(230,57,70,0.12), inset 0 0 30px rgba(230,57,70,0.04)",
      }}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={22} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-black text-red-300 uppercase tracking-wider">Override</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">
                Audit Trail
              </span>
            </div>
            <p className="text-sm text-red-200/90 leading-relaxed">
              Tech Lead <strong className="text-red-100">{tollgate.override.by}</strong> overrode tollgate{" "}
              <strong className="text-red-100">{tollgate.phaseId}_verification</strong> at{" "}
              <strong className="text-red-100">{formatTime(tollgate.override.at)}</strong>.
              {cveId && (
                <>
                  {" "}
                  Security vulnerability{" "}
                  <strong className="text-red-100">{cveId}</strong> accepted with justification:
                </>
              )}
              {!cveId && <> Tollgate failure accepted with justification:</>}
            </p>
            <div
              className="mt-2 p-3 rounded-lg text-sm text-red-200/80 italic"
              style={{
                background: "rgba(230,57,70,0.08)",
                border: "1px solid rgba(230,57,70,0.15)",
              }}
            >
              &ldquo;{tollgate.override.justification}&rdquo;
            </div>
            <p className="mt-2 text-[11px] text-red-400/50 font-medium">
              Logged to audit trail &middot; Visible in Cockpit governance dashboard &middot; Immutable record
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   HANDOVER MANIFEST (passing tollgates)
   ================================================================ */

function HandoverManifest({ phase, nextPhase }: { phase: PhaseState; nextPhase?: PhaseState }) {
  if (!phase.tollgate?.passed || phase.artifacts.length === 0) return null;

  const typeIcons: Record<string, React.ReactNode> = {
    spec: <FileText size={14} className="text-blue-400" />,
    schema: <FileText size={14} className="text-purple-400" />,
    code: <FileText size={14} className="text-amber-400" />,
    test: <CheckCircle size={14} className="text-emerald-400" />,
    config: <FileText size={14} className="text-cyan-400" />,
    doc: <FileText size={14} className="text-white/40" />,
  };

  return (
    <motion.div
      className="mt-6 rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight size={16} className="text-emerald-400" />
          <span className="text-sm font-bold text-white/80">Handover Manifest</span>
          {nextPhase && (
            <span className="ml-auto text-xs text-white/30 flex items-center gap-1.5">
              {phaseLabel(phase.id)}
              <ChevronRight size={12} />
              {phaseLabel(nextPhase.id)}
            </span>
          )}
        </div>

        {/* Artifact list */}
        <div className="space-y-2">
          {phase.artifacts.map((artifact, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {typeIcons[artifact.type] ?? <FileText size={14} className="text-white/30" />}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-white/70">{artifact.name}</span>
                {artifact.preview && (
                  <p className="text-[11px] text-white/30 truncate mt-0.5">{artifact.preview}</p>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-wider text-white/20 font-bold">
                {artifact.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   SECURITY FINDING (prominent display for CVE)
   ================================================================ */

function SecurityFinding({ criterion }: { criterion: TollgateCriterion }) {
  if (criterion.passed || !criterion.details) return null;

  const cveMatch = criterion.details.match(/CVE-\d{4}-\d+/);
  const cveId = cveMatch ? cveMatch[0] : null;

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(230,57,70,0.06)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(230,57,70,0.3)",
        boxShadow: "0 0 24px rgba(230,57,70,0.08)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={18} className="text-red-400" />
          <span className="text-sm font-bold text-red-300">Security Finding</span>
          {cveId && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">
              {cveId}
            </span>
          )}
        </div>

        {cveId && (
          <p className="text-sm text-red-200/80 font-semibold mb-2">
            {cveId}: SQL injection vector in dynamic search query construction
          </p>
        )}

        <p className="text-xs text-white/50 leading-relaxed mb-3">
          {criterion.details}
        </p>

        <div
          className="p-3 rounded-lg"
          style={{
            background: "rgba(0,200,150,0.06)",
            border: "1px solid rgba(0,200,150,0.15)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle size={12} className="text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              Remediation
            </span>
          </div>
          <p className="text-xs text-emerald-200/70">
            Use parameterized queries ($1, $2...) instead of string interpolation for all dynamic search
            query construction.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   MAIN: TOLLGATE VIEW
   ================================================================ */

export function TollgateView() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<"s6" | "s7">("s6");
  const [overrideApplied, setOverrideApplied] = useState<Record<string, { by: string; justification: string; at: string } | undefined>>({});

  const story = state.stories.find((s) => s.id === activeTab);
  if (!story) return null;

  // Find the phase with a tollgate
  const phaseWithTollgate = story.phases?.find((p) => p.tollgate);
  if (!phaseWithTollgate?.tollgate) return null;

  // Merge local override state for demo purposes
  const tollgate: TollgateResult = overrideApplied[activeTab]
    ? { ...phaseWithTollgate.tollgate, override: overrideApplied[activeTab] }
    : phaseWithTollgate.tollgate;

  const nextPhaseIndex = story.phases ? story.phases.findIndex((p) => p.id === phaseWithTollgate.id) + 1 : -1;
  const nextPhase = story.phases && nextPhaseIndex > 0 && nextPhaseIndex < story.phases.length
    ? story.phases[nextPhaseIndex]
    : undefined;

  const failedCriteria = tollgate.criteria.filter((c) => !c.passed);
  const securityFinding = failedCriteria.find(
    (c) => c.details && c.details.includes("CVE")
  );

  function handleOverride(by: string, justification: string) {
    const overrideRecord = { by, justification, at: new Date().toISOString() };
    setOverrideApplied((prev) => ({ ...prev, [activeTab]: overrideRecord }));
    dispatch({
      type: "OVERRIDE_TOLLGATE",
      storyId: story!.id,
      phaseId: phaseWithTollgate!.id,
      by,
      justification,
    });
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-4xl mx-auto">
      {/* ── Story tabs ──────────────────────────────────── */}
      <motion.div
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {(["s6", "s7"] as const).map((sid) => {
          const s = state.stories.find((st) => st.id === sid);
          if (!s) return null;
          const isActive = activeTab === sid;
          const hasFailed = s.phases?.some((p) => p.tollgate && !p.tollgate.passed);

          return (
            <button
              key={sid}
              onClick={() => setActiveTab(sid)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: isActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
                border: isActive
                  ? `1px solid ${hasFailed ? "rgba(230,57,70,0.4)" : "rgba(0,200,150,0.4)"}`
                  : "1px solid rgba(255,255,255,0.06)",
                color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
              }}
            >
              {hasFailed ? (
                <XCircle size={14} className="text-red-400" />
              ) : (
                <CheckCircle size={14} className="text-emerald-400" />
              )}
              {s.key}
            </button>
          );
        })}
      </motion.div>

      {/* ── Override audit banner (top — unmissable) ──── */}
      {tollgate.override && <OverrideAuditBanner tollgate={tollgate} />}

      {/* ── Header ──────────────────────────────────────── */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={24} className="text-white/70" />
          <h1 className="text-2xl font-black text-white/90 tracking-tight">Tollgate Evaluation</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-2">
          {/* Story key + phase */}
          <span className="text-sm font-semibold text-white/50">
            {story.key} &middot; {phaseLabel(tollgate.phaseId)} Phase
          </span>

          {/* Governance mode badge */}
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5"
            style={{
              background: tollgate.mode === "enforced" ? "rgba(230,57,70,0.12)" : "rgba(245,158,11,0.12)",
              color: tollgate.mode === "enforced" ? "#e63946" : "#f59e0b",
              border: `1px solid ${tollgate.mode === "enforced" ? "rgba(230,57,70,0.3)" : "rgba(245,158,11,0.3)"}`,
            }}
          >
            {tollgate.mode === "enforced" ? <Lock size={10} /> : <Unlock size={10} />}
            {tollgate.mode}
          </span>

          {/* Timestamp */}
          <span className="text-xs text-white/30 flex items-center gap-1">
            <Clock size={12} />
            {formatDate(tollgate.evaluatedAt)} &middot; {formatTime(tollgate.evaluatedAt)}
          </span>
        </div>
      </motion.div>

      {/* ── Score ring (center) ─────────────────────────── */}
      <motion.div
        className="flex flex-col items-center gap-3 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ScoreRing score={tollgate.overallScore} passed={tollgate.passed || !!tollgate.override} />

        {/* Status text */}
        {!tollgate.passed && !tollgate.override && (
          <motion.p
            className="text-sm font-semibold text-center max-w-md"
            style={{
              color: tollgate.mode === "enforced" ? "#e63946" : "#f59e0b",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {tollgate.mode === "enforced"
              ? "Pipeline blocked \u2014 remediation required"
              : "Warning \u2014 pipeline may continue"}
          </motion.p>
        )}

        {tollgate.override && (
          <motion.p
            className="text-sm font-semibold text-amber-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Override applied \u2014 pipeline unblocked
          </motion.p>
        )}

        {tollgate.passed && !tollgate.override && (
          <motion.p
            className="text-sm font-semibold text-emerald-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            All criteria met \u2014 clear to proceed
          </motion.p>
        )}
      </motion.div>

      {/* ── Criteria grid ───────────────────────────────── */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Evaluation Criteria</h2>
        <div className="grid gap-3">
          {/* Show failed criteria first */}
          {[...tollgate.criteria]
            .sort((a, b) => (a.passed === b.passed ? 0 : a.passed ? 1 : -1))
            .map((criterion, i) => (
              <CriterionCard key={criterion.name} criterion={criterion} index={i} />
            ))}
        </div>
      </div>

      {/* ── Security finding (prominent) ────────────────── */}
      {securityFinding && !tollgate.override && (
        <div className="mb-6">
          <SecurityFinding criterion={securityFinding} />
        </div>
      )}

      {/* ── Override section ────────────────────────────── */}
      {!tollgate.passed && (
        <OverridePanel tollgate={tollgate} storyId={story.id} onOverride={handleOverride} />
      )}

      {/* ── Handover manifest (passing) ─────────────────── */}
      {(tollgate.passed || tollgate.override) && (
        <HandoverManifest phase={phaseWithTollgate} nextPhase={nextPhase} />
      )}

      {/* ── Navigation ──────────────────────────────────── */}
      <motion.div
        className="flex flex-wrap items-center gap-3 mt-8 pt-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {(tollgate.passed || tollgate.override) && (
          <motion.button
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold"
            style={{
              background: "rgba(0,200,150,0.12)",
              color: "#00c896",
              border: "1px solid rgba(0,200,150,0.3)",
            }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,200,150,0.15)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: "SET_VIEW", view: "session" })}
          >
            Continue to next phase
            <ArrowRight size={16} />
          </motion.button>
        )}

        {!tollgate.passed && !tollgate.override && (
          <motion.button
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold"
            style={{
              background: "rgba(245,158,11,0.12)",
              color: "#f59e0b",
              border: "1px solid rgba(245,158,11,0.3)",
            }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(245,158,11,0.15)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: "SET_VIEW", view: "session" })}
          >
            <RotateCcw size={16} />
            Return to Session
          </motion.button>
        )}

        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/60 transition-colors"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          onClick={() => dispatch({ type: "SET_VIEW", view: "cockpit" })}
        >
          <Eye size={14} />
          View in Cockpit
        </button>
      </motion.div>
    </div>
  );
}

export default TollgateView;
