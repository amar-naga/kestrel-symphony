"use client";

import { useState, useEffect } from "react";
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
  X,
  Package,
  Zap,
  GitBranch,
} from "lucide-react";
import type { TollgateResult, TollgateCriterion, PhaseState } from "@/lib/store";

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
  if (score >= 90) return "#4ade80";
  if (score >= 75) return "#fbbf24";
  if (score >= 50) return "#FF8F5C";
  return "#f87171";
}

function phaseLabel(id: string): string {
  const map: Record<string, string> = { plan: "Plan", design: "Design", build: "Build", deploy: "Deploy" };
  return map[id] ?? id;
}

const phaseAccents: Record<string, string> = {
  plan: "#FF6B2C",
  design: "#999999",
  build: "#FF8F5C",
  deploy: "#666666",
};

/* ================================================================
   SCORE RING (SVG)
   ================================================================ */

function ScoreRing({ score, passed, size = 140 }: { score: number; passed: boolean; size?: number }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = passed ? "#4ade80" : "#f87171";
  const gradientId = passed ? "scoreGradientPass" : "scoreGradientFail";

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 0 ${passed ? '12px rgba(74,222,128,0.3)' : '12px rgba(248,113,113,0.3)'})`,
      }}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 40px ${color}30, 0 0 80px ${color}15` }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={passed ? "#4ade80" : "#f87171"} />
            <stop offset="50%" stopColor={passed ? "#22d3ee" : "#fb923c"} />
            <stop offset="100%" stopColor={passed ? "#4ade80" : "#f87171"} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border-secondary)" strokeWidth={size > 80 ? 10 : 4} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={`url(#${gradientId})`}
          strokeWidth={size > 80 ? 10 : 4} strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="relative flex flex-col items-center z-10">
        <motion.span
          className="font-black tracking-tight leading-none"
          style={{ color, fontSize: size > 100 ? 32 : 24 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {score}
        </motion.span>
        <span
          className="font-bold uppercase tracking-widest mt-1"
          style={{ color, fontSize: 10, letterSpacing: "0.1em" }}
        >
          {passed ? "PASSED" : "FAILED"}
        </span>
      </div>
    </motion.div>
  );
}

/* ================================================================
   CRITERION CARD
   ================================================================ */

function CriterionCard({ criterion, index }: { criterion: TollgateCriterion; index: number }) {
  const passed = criterion.passed;
  const ringColor = passed ? "#22c55e" : "#ef4444";

  return (
    <motion.div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "var(--surface-secondary)",
        border: "1px solid var(--border-secondary)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.08 }}
      whileHover={{ borderColor: "var(--border-primary)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="p-5 flex flex-col items-center text-center flex-1">
        {/* Score — big number in black/grey */}
        <div
          className="text-3xl font-bold tabular-nums mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {criterion.score}
        </div>
        <div className="text-[10px] font-mono uppercase tracking-wider mb-4" style={{ color: "var(--text-ghost)" }}>
          score
        </div>

        {/* Thin progress ring — only ring uses color */}
        <div className="relative w-12 h-12 mb-4">
          <svg width={48} height={48} viewBox="0 0 48 48">
            <circle cx={24} cy={24} r={20} fill="none" stroke="var(--border-secondary)" strokeWidth={3} />
            <circle
              cx={24} cy={24} r={20}
              fill="none"
              stroke={ringColor}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={`${(criterion.score / 100) * 125.66} 125.66`}
              transform="rotate(-90 24 24)"
              style={{ transition: "stroke-dasharray 0.8s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {passed ? (
              <CheckCircle size={16} style={{ color: ringColor }} />
            ) : (
              <XCircle size={16} style={{ color: ringColor }} />
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          {criterion.name}
        </h3>

        {/* Description */}
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-faint)" }}>
          {criterion.description}
        </p>
      </div>

      {/* Failure details footer */}
      {criterion.details && (
        <div
          className="px-4 py-3 text-[11px] leading-relaxed"
          style={{
            borderTop: "1px solid var(--border-secondary)",
            color: "#ef4444",
            background: "rgba(239,68,68,0.04)",
          }}
        >
          {criterion.details}
        </div>
      )}
    </motion.div>
  );
}

/* ================================================================
   OVERRIDE PANEL
   ================================================================ */

function OverridePanel({ tollgate, onOverride }: { tollgate: TollgateResult; onOverride: (by: string, justification: string) => void }) {
  const [showPanel, setShowPanel] = useState(false);
  const [justification, setJustification] = useState("");
  const [techLead] = useState("Sarah Chen \u2014 Tech Lead");

  if (tollgate.passed || tollgate.override) return null;

  return (
    <div className="mt-6">
      {!showPanel ? (
        <motion.button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{ background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(248,113,113,0.15)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowPanel(true)}
        >
          <Unlock size={16} />
          Override Tollgate
        </motion.button>
      ) : (
        <motion.div
          className="rounded-xl overflow-hidden"
          style={{ background: "rgba(248,113,113,0.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(248,113,113,0.25)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} className="text-red-400" />
              <span className="text-sm font-bold text-red-300">Tollgate Override</span>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-red-400/60">Requires Justification</span>
            </div>
            <div className="mb-3">
              <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1 block">Authorizing Lead</label>
              <div className="px-3 py-2 rounded-lg text-sm text-white/80" style={{ background: "var(--surface-primary)", border: "1px solid var(--border-primary)" }}>{techLead}</div>
            </div>
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1 block">Justification <span className="text-red-400">*</span></label>
              <textarea
                className="w-full px-3 py-2 rounded-lg text-sm text-white/90 placeholder:text-white/20 resize-none focus:outline-none focus:ring-1 focus:ring-red-500/40"
                style={{ background: "var(--surface-primary)", border: "1px solid var(--border-primary)" }}
                rows={3}
                placeholder="Explain why this tollgate failure is being overridden..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: justification.trim() ? "rgba(248,113,113,0.2)" : "rgba(248,113,113,0.08)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}
                disabled={!justification.trim()}
                whileHover={justification.trim() ? { scale: 1.02 } : {}}
                whileTap={justification.trim() ? { scale: 0.98 } : {}}
                onClick={() => { if (justification.trim()) onOverride(techLead, justification.trim()); }}
              >
                <ShieldCheck size={16} />
                Confirm Override
              </motion.button>
              <button className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/60 transition-colors" onClick={() => { setShowPanel(false); setJustification(""); }}>Cancel</button>
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
  const cveMatch = failedCriteria.map((c) => c.details ?? "").join(" ").match(/CVE-\d{4}-\d+/);
  const cveId = cveMatch ? cveMatch[0] : null;

  return (
    <motion.div
      className="rounded-xl overflow-hidden mb-6"
      style={{ background: "rgba(248,113,113,0.08)", backdropFilter: "blur(16px)", border: "2px solid rgba(248,113,113,0.4)", boxShadow: "0 0 30px rgba(248,113,113,0.12), inset 0 0 30px rgba(248,113,113,0.04)" }}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={22} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-black text-red-300 uppercase tracking-wider">Override</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">Audit Trail</span>
            </div>
            <p className="text-sm text-red-200/90 leading-relaxed">
              Tech Lead <strong className="text-red-100">{tollgate.override.by}</strong> overrode tollgate{" "}
              <strong className="text-red-100">{tollgate.phaseId}_verification</strong> at{" "}
              <strong className="text-red-100">{formatTime(tollgate.override.at)}</strong>.
              {cveId ? (<> Security vulnerability <strong className="text-red-100">{cveId}</strong> accepted with justification:</>) : (<> Tollgate failure accepted with justification:</>)}
            </p>
            <div className="mt-2 p-3 rounded-lg text-sm text-red-200/80 italic" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)" }}>
              &ldquo;{tollgate.override.justification}&rdquo;
            </div>
            <p className="mt-2 text-[11px] text-red-400/50 font-medium">Logged to audit trail &middot; Visible in Cockpit governance dashboard &middot; Immutable record</p>
          </div>
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
      style={{ background: "rgba(248,113,113,0.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(248,113,113,0.3)", boxShadow: "0 0 24px rgba(248,113,113,0.08)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={18} className="text-red-400" />
          <span className="text-sm font-bold text-red-300">Security Finding</span>
          {cveId && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">{cveId}</span>}
        </div>
        {cveId && <p className="text-sm text-red-200/80 font-semibold mb-2">{cveId}: SQL injection vector in dynamic search query construction</p>}
        <p className="text-xs text-white/50 leading-relaxed mb-3">{criterion.details}</p>
        <div className="p-3 rounded-lg" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle size={12} className="text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Remediation</span>
          </div>
          <p className="text-xs text-emerald-200/70">Use parameterized queries ($1, $2...) instead of string interpolation for all dynamic search query construction.</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   HANDOVER MANIFEST SLIDE-OVER
   ================================================================ */

function HandoverManifestModal({ phase, nextPhase, onClose }: { phase: PhaseState; nextPhase?: PhaseState; onClose: () => void }) {
  const typeIcons: Record<string, React.ReactNode> = {
    spec: <FileText size={14} className="text-blue-400" />,
    schema: <FileText size={14} className="text-purple-400" />,
    code: <FileText size={14} className="text-amber-400" />,
    test: <CheckCircle size={14} className="text-emerald-400" />,
    config: <FileText size={14} className="text-cyan-400" />,
    doc: <FileText size={14} className="text-white/40" />,
  };

  // Simulated decisions and risks per phase
  const decisions: Record<string, string[]> = {
    plan: ["Chose hierarchical RBAC over flat model", "Super Admin inherits all lower permissions", "Audit log required for all permission changes"],
    build: ["Added tenant_id scoping after Code Auditor review", "47 unit tests covering all role x resource combinations"],
    deploy: ["Feature flag enabled for enterprise tier only", "CloudWatch alarms configured for error rate and latency"],
  };

  const risks: Record<string, string[]> = {
    plan: ["Tenant isolation is critical. Must scope all permission checks"],
    build: ["Monitor for performance impact on permission checks at scale"],
    deploy: ["Rollback procedure requires manual feature flag toggle"],
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md h-full overflow-y-auto z-10"
        style={{ background: "var(--panel-bg)", borderLeft: "1px solid var(--border-primary)" }}
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-emerald-400" />
              <h3 className="text-base font-bold text-white/90">Handover Manifest</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">
              <X size={16} />
            </button>
          </div>

          {nextPhase && (
            <div className="flex items-center gap-2 mb-6 text-sm text-white/50">
              <span className="font-semibold" style={{ color: phaseAccents[phase.id] ?? "#888" }}>{phaseLabel(phase.id)}</span>
              <ChevronRight size={14} className="text-white/20" />
              <span className="font-semibold" style={{ color: phaseAccents[nextPhase.id] ?? "#888" }}>{phaseLabel(nextPhase.id)}</span>
            </div>
          )}

          {/* Artifacts */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Artifacts</h4>
            <div className="space-y-2">
              {phase.artifacts.map((artifact, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "var(--surface-secondary)", border: "1px solid var(--border-secondary)" }}>
                  {typeIcons[artifact.type] ?? <FileText size={14} className="text-white/30" />}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-white/70">{artifact.name}</span>
                    {artifact.preview && <p className="text-[11px] text-white/30 truncate mt-0.5">{artifact.preview}</p>}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-white/20 font-bold">{artifact.type}</span>
                </div>
              ))}
              {phase.artifacts.length === 0 && <p className="text-xs text-white/25 italic">No artifacts yet</p>}
            </div>
          </div>

          {/* Decisions */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Key Decisions</h4>
            <div className="space-y-2">
              {(decisions[phase.id] ?? []).map((d, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-white/60">
                  <CheckCircle size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Risks & Watch Items</h4>
            <div className="space-y-2">
              {(risks[phase.id] ?? []).map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-amber-300/70">
                  <AlertTriangle size={12} className="text-amber-400 mt-0.5 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   PHASE TIMELINE ITEM (left sidebar)
   ================================================================ */

function PhaseTimelineItem({
  phase,
  isLast,
  isSelected,
  onClick,
  onViewHandover,
}: {
  phase: PhaseState;
  isLast: boolean;
  isSelected: boolean;
  onClick: () => void;
  onViewHandover?: () => void;
}) {
  const accent = phaseAccents[phase.id] ?? "#888";
  const hasTollgate = !!phase.tollgate;
  const passed = phase.tollgate?.passed || !!phase.tollgate?.override;
  const failed = hasTollgate && !passed;
  const isPending = phase.status === "pending";

  const statusColor = isPending ? "var(--text-ghost)" : passed ? "#4ade80" : failed ? "#f87171" : accent;

  return (
    <div className="flex gap-3">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <motion.button
          onClick={onClick}
          className="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all"
          style={{
            background: isSelected ? `${statusColor}25` : isPending ? "var(--surface-primary)" : `${statusColor}15`,
            border: isSelected ? `2px solid ${statusColor}` : `2px solid ${isPending ? "var(--border-primary)" : `${statusColor}50`}`,
            boxShadow: isSelected ? `0 0 16px ${statusColor}30` : "none",
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPending ? (
            <Clock size={16} className="text-white/25" />
          ) : passed ? (
            <CheckCircle size={16} style={{ color: "#4ade80" }} />
          ) : failed ? (
            <XCircle size={16} style={{ color: "#f87171" }} />
          ) : (
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ background: accent }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>
        {!isLast && (
          <div
            className="w-0.5 flex-1 min-h-[40px]"
            style={{
              background: `linear-gradient(to bottom, ${statusColor}40, var(--border-secondary))`,
            }}
          />
        )}
      </div>

      {/* Phase info */}
      <div className="pb-6 flex-1 min-w-0">
        <button onClick={onClick} className="text-left w-full">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${isSelected ? "text-white/90" : "text-white/60"}`}>
              {phase.name}
            </span>
            {hasTollgate && phase.tollgate && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: passed ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)",
                  color: passed ? "#4ade80" : "#f87171",
                  border: `1px solid ${passed ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                }}
              >
                {phase.tollgate.overallScore}
              </span>
            )}
            {isPending && (
              <span className="text-[10px] font-medium text-white/20 uppercase tracking-wider">Pending</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-white/30">
            {phase.roles.join(", ")}
          </div>
        </button>

        {/* View Handover button for passed phases */}
        {passed && phase.artifacts.length > 0 && onViewHandover && (
          <motion.button
            onClick={(e) => { e.stopPropagation(); onViewHandover(); }}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
            style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}
            whileHover={{ scale: 1.02, background: "rgba(74,222,128,0.15)" }}
            whileTap={{ scale: 0.98 }}
          >
            <Package size={12} />
            View Handover Manifest
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   MAIN: TOLLGATE VIEW
   ================================================================ */

export function TollgateView() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<string>(state.activeStoryId ?? "s6");
  const [overrideApplied, setOverrideApplied] = useState<Record<string, { by: string; justification: string; at: string } | undefined>>({});
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [handoverPhase, setHandoverPhase] = useState<PhaseState | null>(null);

  // Sync active tab when activeStoryId changes
  const currentStoryId = state.activeStoryId ?? "s6";
  if (activeTab !== currentStoryId && state.activeStoryId) {
    setActiveTab(currentStoryId);
  }

  const story = state.stories.find((s) => s.id === activeTab);
  if (!story || !story.phases) return null;

  const phases = story.phases;

  // Determine which phase to show: prefer activePhaseId, then most recently completed phase with tollgate
  const defaultPhaseId =
    selectedPhaseId ??
    state.activePhaseId ??
    [...phases].reverse().find((p) => p.tollgate)?.id ??
    phases[0]?.id;
  const activePhase = phases.find((p) => p.id === defaultPhaseId);
  if (!activePhase) return null;

  const hasTollgate = !!activePhase.tollgate;

  // Merge local override state for demo purposes
  const tollgate: TollgateResult | null = activePhase.tollgate
    ? overrideApplied[`${activeTab}-${activePhase.id}`]
      ? { ...activePhase.tollgate, override: overrideApplied[`${activeTab}-${activePhase.id}`] }
      : activePhase.tollgate
    : null;

  const nextPhaseIndex = phases.findIndex((p) => p.id === activePhase.id) + 1;
  const nextPhase = nextPhaseIndex > 0 && nextPhaseIndex < phases.length ? phases[nextPhaseIndex] : undefined;

  const failedCriteria = tollgate?.criteria.filter((c) => !c.passed) ?? [];
  const securityFinding = failedCriteria.find((c) => c.details && c.details.includes("CVE"));

  // Re-run tollgate state
  const [rerunning, setRerunning] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rerunKey, setRerunKey] = useState(0);

  // Reset rerunning state when switching tabs/phases
  useEffect(() => {
    setRerunning(false);
  }, [activeTab, selectedPhaseId]);

  function handleRerunTollgate() {
    setRerunning(true);
    setTimeout(() => {
      setRerunning(false);
      // If an override was applied, simulate the tollgate now passing
      const key = `${activeTab}-${activePhase!.id}`;
      if (overrideApplied[key]) {
        // Override was applied — re-run passes with improved scores
        dispatch({
          type: "RERUN_TOLLGATE",
          storyId: story!.id,
          phaseId: activePhase!.id as "plan" | "design" | "build" | "deploy",
          newScore: 92,
          passed: true,
        });
        // Clear the local override since store now reflects it
        setOverrideApplied((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      } else {
        // No override — re-run still fails (same scores)
        dispatch({
          type: "RERUN_TOLLGATE",
          storyId: story!.id,
          phaseId: activePhase!.id as "plan" | "design" | "build" | "deploy",
          newScore: activePhase!.tollgate?.overallScore ?? 60,
          passed: false,
        });
      }
      // Force a re-render by bumping a key
      setRerunKey((k) => k + 1);
    }, 2000);
  }

  function handleOverride(by: string, justification: string) {
    const key = `${activeTab}-${activePhase!.id}`;
    const overrideRecord = { by, justification, at: new Date().toISOString() };
    setOverrideApplied((prev) => ({ ...prev, [key]: overrideRecord }));
    dispatch({
      type: "OVERRIDE_TOLLGATE",
      storyId: story!.id,
      phaseId: activePhase!.id as "plan" | "design" | "build" | "deploy",
      by,
      justification,
    });
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-6xl mx-auto">
      {/* Story tabs — dynamically derived from stories with phases */}
      {(() => {
        const symphonyStories = state.stories.filter(s =>
          (s.status === "in_symphony" || s.status === "done") && s.phases && s.phases.length > 0
        );
        return (
          <motion.div className="flex gap-2 mb-6 flex-wrap" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
            {symphonyStories.map((s) => {
              const isActive = activeTab === s.id;
              const hasFailed = s.phases?.some((p) => p.tollgate && !p.tollgate.passed && !p.tollgate.override);

              return (
                <button
                  key={s.id}
                  onClick={() => { setActiveTab(s.id); setSelectedPhaseId(null); }}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: isActive ? "var(--surface-hover)" : "var(--surface-secondary)",
                    border: isActive ? `1px solid ${hasFailed ? "rgba(248,113,113,0.4)" : "rgba(74,222,128,0.4)"}` : "1px solid var(--border-secondary)",
                    color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  }}
                >
                  {hasFailed ? <XCircle size={14} className="text-red-400" /> : <CheckCircle size={14} className="text-emerald-400" />}
                  {s.key}
                </button>
              );
            })}
          </motion.div>
        );
      })()}

      {/* Main layout: Timeline + Details */}
      <div className="flex gap-8">
        {/* Left: Phase Timeline */}
        <motion.div
          className="w-64 shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-white/50" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Phase Timeline</h3>
          </div>

          <div>
            {phases.map((phase, i) => (
              <PhaseTimelineItem
                key={phase.id}
                phase={phase}
                isLast={i === phases.length - 1}
                isSelected={phase.id === defaultPhaseId}
                onClick={() => setSelectedPhaseId(phase.id)}
                onViewHandover={
                  (phase.tollgate?.passed || !!phase.tollgate?.override) && phase.artifacts.length > 0
                    ? () => setHandoverPhase(phase)
                    : undefined
                }
              />
            ))}
          </div>

          {/* Powered by Arc branding */}
          <motion.div
            className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "rgba(255,107,44,0.06)", border: "1px solid rgba(255,107,44,0.12)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <GitBranch size={14} style={{ color: "#FF6B2C" }} />
            <span className="text-[11px] font-semibold" style={{ color: "#FF6B2C" }}>Powered by Arc</span>
            <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>&middot; Governance Engine</span>
          </motion.div>
        </motion.div>

        {/* Right: Tollgate Details */}
        <div className="flex-1 min-w-0">
          {/* Override audit banner */}
          {tollgate?.override && <OverrideAuditBanner tollgate={tollgate} />}

          {/* Pending state */}
          {!hasTollgate && (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: "var(--surface-primary)", border: "2px solid var(--border-primary)" }}
              >
                <Clock size={32} className="text-white/20" />
              </div>
              <h3 className="text-lg font-semibold text-white/50 mb-1">{phaseLabel(activePhase.id)} Phase</h3>
              <p className="text-sm text-white/25">
                {activePhase.status === "pending"
                  ? "Tollgate evaluation has not started yet"
                  : "Phase is currently in progress"}
              </p>
              <p className="text-xs text-white/15 mt-2">Roles: {activePhase.roles.join(", ")}</p>
            </motion.div>
          )}

          {/* Active tollgate details */}
          {tollgate && (
            <>
              {/* Header */}
              <motion.div className="mb-6" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-3 mb-1">
                  <ShieldCheck size={20} style={{ color: "#FF6B2C" }} />
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Tollgate Evaluation</h2>
                </div>
                <p className="text-sm mb-4" style={{ color: "var(--text-faint)" }}>
                  Quality gates powered by Arc. Enforcing governance at every phase transition
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-white/50">{story.key} &middot; {phaseLabel(tollgate.phaseId)} Phase</span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5"
                    style={{
                      background: tollgate.mode === "enforced" ? "rgba(248,113,113,0.12)" : "rgba(245,158,11,0.12)",
                      color: tollgate.mode === "enforced" ? "#f87171" : "#f59e0b",
                      border: `1px solid ${tollgate.mode === "enforced" ? "rgba(248,113,113,0.3)" : "rgba(245,158,11,0.3)"}`,
                    }}
                  >
                    {tollgate.mode === "enforced" ? <Lock size={10} /> : <Unlock size={10} />}
                    {tollgate.mode}
                  </span>
                  <span className="text-xs text-white/30 flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(tollgate.evaluatedAt)} &middot; {formatTime(tollgate.evaluatedAt)}
                  </span>

                  {/* Action buttons — inline with header */}
                  <div className="ml-auto flex items-center gap-2">
                    {(tollgate.passed || tollgate.override) && (() => {
                      const isLastPhase = !nextPhase;
                      return (
                        <motion.button
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold"
                          style={{ background: "linear-gradient(135deg, #FF6B2C, #CC5623)", color: "#fff" }}
                          whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(255,107,44,0.3)" }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            dispatch({ type: "COMPLETE_PHASE", storyId: story.id, phaseId: activePhase.id as "plan" | "design" | "build" | "deploy" });
                            if (isLastPhase) {
                              dispatch({ type: "MARK_STORY_DONE", storyId: story.id });
                              dispatch({ type: "SET_VIEW", view: "cockpit" });
                            } else {
                              dispatch({ type: "START_PHASE", storyId: story.id, phaseId: nextPhase!.id as "plan" | "design" | "build" | "deploy" });
                              dispatch({ type: "SET_ACTIVE_PHASE", phaseId: nextPhase!.id as "plan" | "design" | "build" | "deploy" });
                              dispatch({ type: "SET_VIEW", view: "session" });
                            }
                          }}
                        >
                          {isLastPhase ? "Mark Story Complete" : "Continue to next phase"}
                          <ArrowRight size={14} />
                        </motion.button>
                      );
                    })()}
                    {!tollgate.passed && !tollgate.override && (
                      <motion.button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold"
                        style={{ background: "var(--surface-primary)", color: "var(--text-secondary)", border: "1px solid var(--border-primary)" }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => dispatch({ type: "SET_VIEW", view: "session" })}
                      >
                        <RotateCcw size={14} />
                        Return to Session
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Glass card with score ring + summary + criteria */}
              <div className="glass-card p-6 mb-6">
                {/* Score ring centered */}
                <motion.div className="flex flex-col items-center gap-3 mb-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                  <ScoreRing score={tollgate.overallScore} passed={tollgate.passed || !!tollgate.override} />
                  {!tollgate.passed && !tollgate.override && (
                    <motion.p className="text-sm font-semibold text-center max-w-md" style={{ color: tollgate.mode === "enforced" ? "#f87171" : "#f59e0b" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                      {tollgate.mode === "enforced" ? "Pipeline blocked. Remediation required" : "Warning: pipeline may continue"}
                    </motion.p>
                  )}
                  {tollgate.override && (
                    <motion.p className="text-sm font-semibold text-amber-400 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                      Override applied. Pipeline unblocked
                    </motion.p>
                  )}
                  {tollgate.passed && !tollgate.override && (
                    <motion.p className="text-sm font-semibold text-emerald-400 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                      All criteria met. Clear to proceed
                    </motion.p>
                  )}
                </motion.div>

                {/* Tollgate Summary — 3 vertical cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div
                    className="rounded-xl p-4 text-center"
                    style={{
                      background: "var(--surface-secondary)",
                      border: "1px solid var(--border-secondary)",
                    }}
                  >
                    <div className="text-2xl font-bold tabular-nums mb-1" style={{ color: "var(--text-primary)" }}>
                      {tollgate.criteria.filter(c => c.passed).length}/{tollgate.criteria.length}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>
                      Criteria Passed
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-4 text-center"
                    style={{
                      background: "var(--surface-secondary)",
                      border: "1px solid var(--border-secondary)",
                    }}
                  >
                    <div className="text-2xl font-bold tabular-nums mb-1" style={{ color: "var(--text-primary)" }}>
                      {tollgate.overallScore}%
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>
                      Overall Score
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-4 text-center"
                    style={{
                      background: "var(--surface-secondary)",
                      border: "1px solid var(--border-secondary)",
                    }}
                  >
                    <div className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                      {tollgate.mode === "enforced" ? "Enforced" : "Advisory"}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>
                      Governance Mode
                    </div>
                  </div>
                </div>

                {/* Security finding */}
                {securityFinding && !tollgate.override && (
                  <div className="mb-4"><SecurityFinding criterion={securityFinding} /></div>
                )}

                {/* Override section */}
                {!tollgate.passed && <div className="mb-4"><OverridePanel tollgate={tollgate} onOverride={handleOverride} /></div>}

                {/* Criteria list — vertical cards centered */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-4 text-center" style={{ color: "var(--text-faint)" }}>Evaluation Criteria</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {[...tollgate.criteria]
                      .sort((a, b) => (a.passed === b.passed ? 0 : a.passed ? 1 : -1))
                      .map((criterion, i) => (
                        <CriterionCard key={criterion.name} criterion={criterion} index={i} />
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Handover Manifest slide-over */}
      <AnimatePresence>
        {handoverPhase && (
          <HandoverManifestModal
            phase={handoverPhase}
            nextPhase={phases[phases.findIndex((p) => p.id === handoverPhase.id) + 1]}
            onClose={() => setHandoverPhase(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default TollgateView;
