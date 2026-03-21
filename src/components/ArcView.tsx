"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import {
  GitBranch,
  Settings,
  ShieldCheck,
  DollarSign,
  Globe,
  Plus,
  RotateCcw,
  Save,
  Check,
  ChevronDown,
  AlertTriangle,
  Lock,
  Eye,
  ArrowRight,
} from "lucide-react";

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
  },
};

/* ================================================================
   DATA: DEFAULT CRITERIA PER PHASE
   ================================================================ */

type FailAction = "block" | "warn" | "escalate";

interface Criterion {
  name: string;
  description: string;
  weight: number;
  enabled: boolean;
  failAction: FailAction;
}

const DEFAULT_CRITERIA: Record<string, Criterion[]> = {
  plan: [
    { name: "Requirements completeness", description: "All user stories have acceptance criteria", weight: 3, enabled: true, failAction: "block" },
    { name: "Stakeholder sign-off", description: "Product owner has reviewed scope", weight: 2, enabled: true, failAction: "block" },
    { name: "Security review", description: "Security implications documented", weight: 3, enabled: true, failAction: "warn" },
    { name: "Effort estimation", description: "Story points validated against historical data", weight: 1, enabled: true, failAction: "warn" },
  ],
  build: [
    { name: "Tests passing", description: "All unit and integration tests pass", weight: 2, enabled: true, failAction: "block" },
    { name: "Code coverage", description: "Coverage meets threshold", weight: 1, enabled: true, failAction: "warn" },
    { name: "Security scan", description: "No critical or high vulnerabilities", weight: 3, enabled: true, failAction: "block" },
    { name: "Code review", description: "Peer review approved", weight: 2, enabled: true, failAction: "block" },
    { name: "Performance benchmark", description: "P95 latency within SLA", weight: 2, enabled: true, failAction: "warn" },
    { name: "Dependency audit", description: "No known vulnerable dependencies", weight: 2, enabled: true, failAction: "block" },
  ],
  deploy: [
    { name: "Staging validation", description: "All smoke tests pass in staging", weight: 3, enabled: true, failAction: "block" },
    { name: "Rollback plan", description: "Rollback procedure documented and tested", weight: 2, enabled: true, failAction: "block" },
    { name: "Monitoring configured", description: "Alerts and dashboards in place", weight: 2, enabled: true, failAction: "warn" },
    { name: "Change window", description: "Deployment within approved change window", weight: 1, enabled: true, failAction: "warn" },
  ],
};

const DEFAULT_THRESHOLDS: Record<string, number> = { plan: 80, build: 80, deploy: 90 };
const DEFAULT_MODES: Record<string, "enforced" | "advisory"> = { plan: "enforced", build: "enforced", deploy: "enforced" };

/* ================================================================
   DATA: GOVERNANCE RULES
   ================================================================ */

interface GovernanceRule {
  name: string;
  description: string;
  enabled: boolean;
}

const INITIAL_GOVERNANCE_RULES: GovernanceRule[] = [
  { name: "Override requires justification", description: "Any tollgate override must include a written justification and authorizer name", enabled: true },
  { name: "Failed security = auto-block", description: "Security scan failures always block, regardless of overall score", enabled: true },
  { name: "Max 2 retries before escalation", description: "After 2 failed tollgate attempts, escalate to human lead", enabled: true },
  { name: "Audit trail immutable", description: "All tollgate decisions, overrides, and escalations are logged permanently", enabled: true },
  { name: "Cost ceiling enforcement", description: "Auto-pause agent work when story cost exceeds budget ceiling", enabled: true },
  { name: "PII detection in outputs", description: "Scan all agent outputs for personally identifiable information", enabled: false },
  { name: "Mandatory human review for PRs > 500 lines", description: "Large PRs require explicit human approval before merge", enabled: true },
];

/* ================================================================
   DATA: INDUSTRY PRESETS
   ================================================================ */

interface Preset {
  name: string;
  description: string;
  icon: typeof Settings;
}

const PRESETS: Preset[] = [
  { name: "Default", description: "Standard SDLC governance with balanced security and speed", icon: Settings },
  { name: "Healthcare", description: "HIPAA-compliant with PHI detection, audit requirements, and access controls", icon: ShieldCheck },
  { name: "Financial Services", description: "SOX compliance, PCI-DSS checks, transaction audit trails", icon: DollarSign },
  { name: "Government", description: "FedRAMP aligned, NIST controls, data residency enforcement", icon: Globe },
];

/* ================================================================
   PHASE PIPELINE
   ================================================================ */

const PHASES = [
  { id: "plan", label: "Plan", color: "#FF6B2C" },
  { id: "build", label: "Build", color: "#FF8F5C" },
  { id: "deploy", label: "Deploy", color: "#FFB088" },
];

function PhasePipeline({ activePhase, onSelect }: { activePhase: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex items-center justify-center gap-0 py-6">
      {PHASES.map((phase, i) => {
        const isActive = activePhase === phase.id;
        return (
          <div key={phase.id} className="flex items-center">
            {/* Connector line before (except first) */}
            {i > 0 && (
              <div className="relative w-16 h-[2px] mx-1">
                <div className="absolute inset-0" style={{ background: "var(--border-primary)" }} />
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ background: `linear-gradient(90deg, ${PHASES[i - 1].color}, ${phase.color})` }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: i * 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ color: phase.color }}
                  initial={{ left: 0, opacity: 0 }}
                  animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2, delay: i * 0.25, repeat: Infinity, repeatDelay: 3 }}
                >
                  <ArrowRight size={10} />
                </motion.div>
              </div>
            )}

            {/* Phase node */}
            <motion.button
              onClick={() => onSelect(phase.id)}
              className="relative flex flex-col items-center gap-2 px-8 py-4 rounded-xl transition-all cursor-pointer"
              style={{
                background: isActive ? `${phase.color}12` : "var(--surface-secondary)",
                border: isActive ? `2px solid ${phase.color}` : "1px solid var(--border-primary)",
                boxShadow: isActive ? `0 0 24px ${phase.color}20` : "none",
                minWidth: 110,
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 0 28px ${phase.color}30` }}
              whileTap={{ scale: 0.97 }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: isActive ? `${phase.color}25` : "var(--surface-primary)",
                  color: isActive ? phase.color : "var(--text-faint)",
                  border: isActive ? `2px solid ${phase.color}` : "1px solid var(--border-primary)",
                }}
              >
                {i + 1}
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: isActive ? phase.color : "var(--text-secondary)" }}
              >
                {phase.label}
              </span>
              <span
                className="text-[9px]"
                style={{ color: isActive ? phase.color : "var(--text-ghost)" }}
              >
                {isActive ? "Editing" : "Click to configure"}
              </span>
              {isActive && (
                <motion.div
                  layoutId="phase-active-dot"
                  className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                  style={{ background: phase.color }}
                />
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   TOGGLE SWITCH
   ================================================================ */

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0"
      style={{
        background: checked
          ? "linear-gradient(135deg, #FF6B2C, #FF8F5C)"
          : "var(--surface-primary)",
        border: checked ? "none" : "1px solid var(--border-primary)",
      }}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full"
        style={{
          background: checked ? "#fff" : "var(--text-faint)",
          left: 2,
        }}
        animate={{ x: checked ? 16 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* ================================================================
   FAIL ACTION DROPDOWN
   ================================================================ */

function FailActionSelect({ value, onChange }: { value: FailAction; onChange: (v: FailAction) => void }) {
  const [open, setOpen] = useState(false);
  const options: { value: FailAction; label: string; color: string; icon: typeof Lock }[] = [
    { value: "block", label: "Block", color: "#f87171", icon: Lock },
    { value: "warn", label: "Warn", color: "#fbbf24", icon: AlertTriangle },
    { value: "escalate", label: "Escalate", color: "#60a5fa", icon: Eye },
  ];
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all"
        style={{
          background: `${current.color}15`,
          border: `1px solid ${current.color}35`,
          color: current.color,
        }}
      >
        <current.icon size={10} />
        {current.label}
        <ChevronDown size={10} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
            style={{ background: "var(--panel-bg)", border: "1px solid var(--border-primary)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-[var(--surface-hover)]"
                style={{ color: opt.color }}
              >
                <opt.icon size={10} />
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   WEIGHT SELECTOR
   ================================================================ */

function WeightSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((w) => (
        <button
          key={w}
          onClick={() => onChange(w)}
          className="w-7 h-6 rounded text-[10px] font-bold transition-all"
          style={{
            background: value === w ? "linear-gradient(135deg, #FF6B2C, #FF8F5C)" : "var(--surface-primary)",
            color: value === w ? "#fff" : "var(--text-faint)",
            border: value === w ? "none" : "1px solid var(--border-primary)",
          }}
        >
          {w}x
        </button>
      ))}
    </div>
  );
}

/* ================================================================
   MAIN ARC VIEW
   ================================================================ */

export function ArcView() {
  const { state } = useApp();

  /* ── Local state ──────────────────────────────────────────── */
  const [activePhase, setActivePhase] = useState("plan");
  const [criteria, setCriteria] = useState<Record<string, Criterion[]>>(structuredClone(DEFAULT_CRITERIA));
  const [thresholds, setThresholds] = useState<Record<string, number>>({ ...DEFAULT_THRESHOLDS });
  const [phaseModes, setPhaseModes] = useState<Record<string, "enforced" | "advisory">>({ ...DEFAULT_MODES });
  const [govRules, setGovRules] = useState<GovernanceRule[]>([...INITIAL_GOVERNANCE_RULES.map((r) => ({ ...r }))]);
  const [activePreset, setActivePreset] = useState("Default");
  const [saved, setSaved] = useState(false);

  /* ── Helpers ──────────────────────────────────────────────── */
  const currentCriteria = criteria[activePhase] ?? [];

  function updateCriterion(index: number, patch: Partial<Criterion>) {
    setCriteria((prev) => ({
      ...prev,
      [activePhase]: prev[activePhase].map((c, i) => (i === index ? { ...c, ...patch } : c)),
    }));
  }

  function addCriterion() {
    setCriteria((prev) => ({
      ...prev,
      [activePhase]: [
        ...prev[activePhase],
        { name: "New criterion", description: "Describe the quality gate", weight: 1, enabled: true, failAction: "warn" as FailAction },
      ],
    }));
  }

  function handleSave() {
    setSaved(true);
  }

  function handleReset() {
    setCriteria(structuredClone(DEFAULT_CRITERIA));
    setThresholds({ ...DEFAULT_THRESHOLDS });
    setPhaseModes({ ...DEFAULT_MODES });
    setGovRules([...INITIAL_GOVERNANCE_RULES.map((r) => ({ ...r }))]);
    setActivePreset("Default");
  }

  function applyPreset(name: string) {
    setActivePreset(name);
    // In production this would load preset-specific criteria
    // For the demo, just mark the preset as active
  }

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  /* ── Phase accent color ──────────────────────────────────── */
  const phaseColor = PHASES.find((p) => p.id === activePhase)?.color ?? "#FF8F5C";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">

      {/* ============================================================
         HEADER
         ============================================================ */}
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="text-center space-y-2 pt-2"
      >
        <motion.div variants={stagger.item} className="flex items-center justify-center gap-2">
          <GitBranch size={20} style={{ color: "#FF6B2C" }} />
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Arc Workflow Governance
          </h1>
        </motion.div>
        <motion.p variants={stagger.item} className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Customize tollgate criteria, scoring weights, and governance rules for your organization.
        </motion.p>
        <motion.p variants={stagger.item} className="text-xs font-mono" style={{ color: "var(--text-faint)" }}>
          Powered by Arc &mdash; &quot;Define it. Arc builds it.&quot;
        </motion.p>
      </motion.div>

      {/* ============================================================
         SECTION 1: PHASE PIPELINE
         ============================================================ */}
      <motion.div
        variants={stagger.item}
        initial="hidden"
        animate="show"
        className="rounded-2xl p-6"
        style={{
          background: "var(--surface-secondary)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <PhasePipeline activePhase={activePhase} onSelect={setActivePhase} />
      </motion.div>

      {/* ============================================================
         SECTION 2: PER-PHASE TOLLGATE CONFIGURATION
         ============================================================ */}
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "var(--surface-secondary)",
          border: "1px solid var(--border-primary)",
        }}
      >
        {/* Section header */}
        <motion.div variants={stagger.item} className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              <span style={{ color: phaseColor }}>{activePhase.charAt(0).toUpperCase() + activePhase.slice(1)}</span>{" "}
              Tollgate Criteria
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
              {currentCriteria.filter((c) => c.enabled).length} of {currentCriteria.length} criteria active
            </p>
          </div>

          {/* Governance mode toggle for this phase */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase" style={{ color: "var(--text-faint)" }}>Mode</span>
            <div className="flex items-center gap-0.5 text-[10px]">
              <button
                onClick={() => setPhaseModes((p) => ({ ...p, [activePhase]: "enforced" }))}
                className="px-2 py-1 rounded-l-md transition-all border"
                style={phaseModes[activePhase] === "enforced"
                  ? { background: "rgba(239,68,68,0.12)", color: "#f87171", borderColor: "rgba(239,68,68,0.3)" }
                  : { background: "var(--surface-primary)", color: "var(--text-faint)", borderColor: "var(--border-primary)" }
                }
              >
                Enforced
              </button>
              <button
                onClick={() => setPhaseModes((p) => ({ ...p, [activePhase]: "advisory" }))}
                className="px-2 py-1 rounded-r-md transition-all border"
                style={phaseModes[activePhase] === "advisory"
                  ? { background: "rgba(245,158,11,0.12)", color: "#f59e0b", borderColor: "rgba(245,158,11,0.3)" }
                  : { background: "var(--surface-primary)", color: "var(--text-faint)", borderColor: "var(--border-primary)" }
                }
              >
                Advisory
              </button>
            </div>
          </div>
        </motion.div>

        {/* Criteria list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {currentCriteria.map((criterion, idx) => (
              <motion.div
                key={`${activePhase}-${idx}`}
                variants={stagger.item}
                className="flex items-center gap-4 p-3 rounded-xl transition-all"
                style={{
                  background: criterion.enabled ? "var(--surface-primary)" : "transparent",
                  border: criterion.enabled ? "1px solid var(--border-primary)" : "1px solid transparent",
                  opacity: criterion.enabled ? 1 : 0.5,
                }}
              >
                {/* Toggle */}
                <Toggle checked={criterion.enabled} onChange={(v) => updateCriterion(idx, { enabled: v })} />

                {/* Name & description */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={criterion.name}
                    onChange={(e) => updateCriterion(idx, { name: e.target.value })}
                    className="block w-full text-sm font-medium bg-transparent border-none outline-none"
                    style={{ color: "var(--text-primary)" }}
                  />
                  <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                    {criterion.description}
                  </span>
                </div>

                {/* Weight */}
                <WeightSelector value={criterion.weight} onChange={(v) => updateCriterion(idx, { weight: v })} />

                {/* Fail action */}
                <FailActionSelect value={criterion.failAction} onChange={(v) => updateCriterion(idx, { failAction: v })} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Add criterion */}
        <motion.button
          variants={stagger.item}
          onClick={addCriterion}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
          style={{
            color: phaseColor,
            background: `${phaseColor}10`,
            border: `1px dashed ${phaseColor}40`,
          }}
          whileHover={{ background: `${phaseColor}20` }}
        >
          <Plus size={12} />
          Add criterion
        </motion.button>

        {/* Pass threshold */}
        <motion.div variants={stagger.item} className="flex items-center gap-4 pt-2" style={{ borderTop: "1px solid var(--border-primary)" }}>
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Pass threshold</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={50}
              max={100}
              value={thresholds[activePhase]}
              onChange={(e) => setThresholds((p) => ({ ...p, [activePhase]: Number(e.target.value) }))}
              className="w-32 accent-[#FF6B2C]"
            />
            <span className="text-sm font-bold font-mono w-10 text-right" style={{ color: phaseColor }}>
              {thresholds[activePhase]}%
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* ============================================================
         SECTION 3: GOVERNANCE RULES
         ============================================================ */}
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "var(--surface-secondary)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <motion.div variants={stagger.item}>
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Governance Rules
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
            Organization-wide policies applied across all phases
          </p>
        </motion.div>

        <div className="space-y-2">
          {govRules.map((rule, idx) => (
            <motion.div
              key={idx}
              variants={stagger.item}
              className="flex items-center gap-4 p-3 rounded-xl transition-all"
              style={{
                background: rule.enabled ? "var(--surface-primary)" : "transparent",
                border: rule.enabled ? "1px solid var(--border-primary)" : "1px solid transparent",
                opacity: rule.enabled ? 1 : 0.55,
              }}
            >
              <Toggle
                checked={rule.enabled}
                onChange={(v) => {
                  setGovRules((prev) => prev.map((r, i) => (i === idx ? { ...r, enabled: v } : r)));
                }}
              />
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {rule.name}
                </span>
                <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                  {rule.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ============================================================
         SECTION 4: INDUSTRY PRESETS
         ============================================================ */}
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: "var(--surface-secondary)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <motion.div variants={stagger.item}>
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Industry Presets
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
            Pre-configured governance profiles for regulated industries
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRESETS.map((preset) => {
            const isActive = activePreset === preset.name;
            const Icon = preset.icon;
            return (
              <motion.button
                key={preset.name}
                variants={stagger.item}
                onClick={() => applyPreset(preset.name)}
                className="relative flex flex-col items-start gap-2 p-4 rounded-xl text-left transition-all"
                style={{
                  background: isActive ? "rgba(255,107,44,0.08)" : "var(--surface-primary)",
                  border: isActive ? "1.5px solid rgba(255,107,44,0.4)" : "1px solid var(--border-primary)",
                  boxShadow: isActive ? "0 0 20px rgba(255,107,44,0.12)" : "none",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: isActive ? "rgba(255,107,44,0.15)" : "var(--surface-secondary)",
                    color: isActive ? "#FF6B2C" : "var(--text-secondary)",
                  }}
                >
                  <Icon size={16} />
                </div>
                <span className="text-sm font-semibold" style={{ color: isActive ? "#FF6B2C" : "var(--text-primary)" }}>
                  {preset.name}
                </span>
                <span className="text-[11px] leading-tight" style={{ color: "var(--text-faint)" }}>
                  {preset.description}
                </span>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #FF6B2C, #FF8F5C)" }}
                  >
                    <Check size={10} color="#fff" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ============================================================
         SECTION 5: SAVE / RESET BAR
         ============================================================ */}
      <div
        className="sticky bottom-0 z-30 -mx-6 px-8 py-4 flex items-center justify-between rounded-t-2xl"
        style={{
          background: "var(--panel-bg)",
          borderTop: "1px solid var(--border-primary)",
          backdropFilter: "blur(16px)",
        }}
      >
        <span className="text-xs" style={{ color: "var(--text-faint)" }}>
          Changes are applied to all new stories in this workspace
        </span>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: "var(--surface-primary)",
              border: "1px solid var(--border-primary)",
              color: "var(--text-secondary)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw size={12} />
            Reset to Defaults
          </motion.button>

          <motion.button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: saved
                ? "linear-gradient(135deg, #4ade80, #22c55e)"
                : "linear-gradient(135deg, #FF6B2C, #FF8F5C)",
              color: "#fff",
              boxShadow: saved ? "0 0 20px rgba(74,222,128,0.3)" : "0 0 20px rgba(255,107,44,0.3)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {saved ? (
              <>
                <Check size={12} />
                Saved
              </>
            ) : (
              <>
                <Save size={12} />
                Save Configuration
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
