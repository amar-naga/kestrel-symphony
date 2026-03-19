"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ROLES, ENGINES, VERTICALS } from "@/lib/roles";
import { useTeam } from "@/lib/store";
import { RoleIcon } from "./RoleIcon";
import {
  ChevronRight,
  Check,
  X,
  Zap,
  Terminal,
  Rocket,
  Play,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

type DeployPhase = "idle" | "deploying" | "done";

function TypewriterText({ text, delay = 0, speed = 20 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);
  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="cursor-blink text-[var(--accent-cyan)]">|</span>}
    </span>
  );
}

function DeploySequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Parsing ROLE_CARD.yaml manifests...", duration: 800 },
    { label: "Validating Arc tollgate configuration...", duration: 600 },
    { label: "Generating CrewAI execution plan...", duration: 1000 },
    { label: "Configuring MCP tool connections...", duration: 700 },
    { label: "Initializing A2A agent protocols...", duration: 600 },
    { label: "Deploying to Kestrel runtime...", duration: 1200 },
    { label: "Starting observability pipeline...", duration: 500 },
    { label: "Team deployed successfully.", duration: 0 },
  ];

  useEffect(() => {
    if (step < steps.length - 1) {
      const timer = setTimeout(() => setStep((s) => s + 1), steps[step].duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-8 max-w-2xl mx-auto relative overflow-hidden"
    >
      {/* Scan line */}
      <div className="scan-line" />

      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={18} className="text-[var(--accent-cyan)]" />
        </motion.div>
        <span className="text-sm font-mono text-white/50">Deploying to Kestrel</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)]"
          initial={{ width: "0%" }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ boxShadow: "0 0 12px var(--accent-cyan)" }}
        />
      </div>

      <div className="space-y-2 font-mono text-sm">
        {steps.slice(0, step + 1).map((s, i) => {
          const isDone = i < step;
          const isCurrent = i === step;
          const isLast = i === steps.length - 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              {isDone || (isLast && isCurrent) ? (
                <CheckCircle2 size={14} className="text-[var(--accent-green)] shrink-0" />
              ) : (
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-3.5 h-3.5 rounded-full border border-[var(--accent-cyan)] shrink-0"
                />
              )}
              <span
                className={
                  isLast && isCurrent
                    ? "text-[var(--accent-green)]"
                    : isDone
                      ? "text-white/40"
                      : "text-white/70"
                }
              >
                {isCurrent ? <TypewriterText text={s.label} speed={15} /> : s.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {step === steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mt-6 text-center"
        >
          <div className="text-[var(--accent-green)] text-lg font-semibold">
            Team Online
          </div>
          <div className="text-white/30 text-xs mt-1">
            4 roles · 3 tollgates · Enforced governance
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function DeployView() {
  const { state, dispatch } = useTeam();
  const [deployPhase, setDeployPhase] = useState<DeployPhase>("idle");
  const selectedRoles = ROLES.filter((r) =>
    state.selectedRoles.includes(r.role_id)
  ).sort((a, b) => a.stage_order - b.stage_order);
  const vertical = VERTICALS.find((v) => v.id === state.vertical);

  if (deployPhase === "deploying") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <DeploySequence onComplete={() => setDeployPhase("done")} />
      </div>
    );
  }

  if (deployPhase === "done") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-[var(--accent-green)]" />
          </div>
          {/* Ripple effects */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-[var(--accent-green)]/20"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
            />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white/90">Deployed to Kestrel</h2>
          <p className="text-white/40 text-sm mt-2">
            {selectedRoles.length} roles active · {state.engine} engine · {vertical?.label} vertical
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch({ type: "SET_VIEW", view: "cockpit" })}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-cyan)] rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-opacity" />
          <div className="relative glass-card px-8 py-4 flex items-center gap-3 text-white">
            <span className="font-semibold">Open Cockpit</span>
            <ChevronRight size={18} />
          </div>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Rocket size={14} className="text-[var(--accent-purple)]" />
          <span className="text-[10px] font-mono text-white/25 uppercase tracking-[0.3em]">
            Choose Engine & Deploy
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white/90">Deploy</h1>
        <p className="text-white/35 text-sm">
          The engine is pluggable. Your ROLE_CARD.yaml is the contract.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Engine Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            Execution Engine
          </h2>
          {ENGINES.map((engine, ei) => {
            const isSelected = state.engine === engine.id;
            return (
              <motion.button
                key={engine.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + ei * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() =>
                  dispatch({ type: "SET_ENGINE", engine: engine.id })
                }
                className={`w-full text-left glass-card p-5 transition-all cursor-pointer ${
                  isSelected ? "glow-purple" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={isSelected ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <Zap
                        size={16}
                        className={isSelected ? "text-[var(--accent-purple)]" : "text-white/20"}
                      />
                    </motion.div>
                    <span className="font-semibold text-white/90">
                      {engine.name}
                    </span>
                    {engine.id === "crewai" && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20">
                        Recommended
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-7 h-7 rounded-full bg-[var(--accent-purple)] flex items-center justify-center"
                      style={{ boxShadow: "0 0 15px rgba(123,47,247,0.5)" }}
                    >
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
                <p className="text-sm text-white/35 mb-3">
                  {engine.description}
                </p>
                <div className="flex gap-6">
                  <div className="space-y-1">
                    {engine.pros.map((p) => (
                      <div key={p} className="text-[11px] text-green-400/60 flex items-center gap-1.5">
                        <Check size={10} />
                        {p}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {engine.cons.map((c) => (
                      <div key={c} className="text-[11px] text-red-400/40 flex items-center gap-1.5">
                        <X size={10} />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* LLM Per-Role Cost */}
          <div className="glass-card p-5">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">
              LLM Assignment Per Role · Estimated Cost
            </h3>
            <div className="space-y-2">
              {selectedRoles.map((role) => {
                const llmMap: Record<number, { model: string; cost: string; reason: string }> = {
                  1: { model: "Claude Opus 4.6", cost: "$2.40", reason: "Complex business analysis" },
                  2: { model: "Claude Sonnet 4", cost: "$0.60", reason: "Process pattern matching" },
                  3: { model: "Claude Sonnet 4", cost: "$0.45", reason: "Schema validation" },
                  4: { model: "Claude Opus 4.6", cost: "$1.80", reason: "Code generation" },
                  5: { model: "Claude Haiku 4.5", cost: "$0.12", reason: "Monitoring alerts" },
                };
                const config = llmMap[role.stage_order] || llmMap[3];
                return (
                  <div key={role.role_id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <RoleIcon name={role.icon} size={12} />
                      <span className="text-white/50">{role.display_name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white/25 font-mono text-[10px]">{config.model}</span>
                      <span className="text-white/60 font-mono font-semibold w-14 text-right">{config.cost}</span>
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-white/5 pt-2 mt-2 flex items-center justify-between text-xs">
                <span className="text-white/30">Estimated per run</span>
                <span className="text-white/80 font-mono font-bold">
                  ${selectedRoles.reduce((sum, role) => {
                    const costs: Record<number, number> = { 1: 2.4, 2: 0.6, 3: 0.45, 4: 1.8, 5: 0.12 };
                    return sum + (costs[role.stage_order] || 0.5);
                  }, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Generated Plan Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            Execution Plan Preview
          </h2>
          <div className="glass-card p-5 font-mono text-xs overflow-auto max-h-[520px] relative">
            {/* Scan line */}
            <div className="scan-line" style={{ animationDuration: "4s" }} />

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
              <Terminal size={12} className="text-[var(--accent-cyan)]" />
              <span className="text-white/50">symphony-plan.yaml</span>
              <div className="ml-auto flex items-center gap-1.5 text-[10px] text-white/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
                valid
              </div>
            </div>
            <pre className="text-white/50 leading-loose whitespace-pre-wrap">
              <span className="text-[var(--accent-purple)]/80"># Kestrel Symphony Execution Plan</span>
              {"\n"}
              <span className="text-[var(--accent-cyan)]">engine</span>
              {`: ${state.engine}\n`}
              <span className="text-[var(--accent-cyan)]">vertical</span>
              {`: ${state.vertical}\n`}
              <span className="text-[var(--accent-cyan)]">governance</span>
              {`: ${state.governanceMode}\n`}
              <span className="text-[var(--accent-cyan)]">protocols</span>
              {`: [MCP, A2A]\n`}
              <span className="text-[var(--accent-cyan)]">llm</span>
              {`: claude-sonnet-4  # per-role override supported\n\n`}
              <span className="text-[var(--accent-purple)]/80"># Team Composition</span>
              {"\n"}
              <span className="text-[var(--accent-cyan)]">team</span>
              {":\n"}
              {selectedRoles.map(
                (role) =>
                  `  - role: ${role.role_id}\n    stage: ${role.stage_order}\n    stage_name: ${role.stage_name}\n    skills: [${role.capabilities.skills.join(", ")}]\n\n`
              )}
              <span className="text-[var(--accent-purple)]/80"># Arc Tollgates</span>
              {"\n"}
              <span className="text-[var(--accent-cyan)]">tollgates</span>
              {":\n"}
              {selectedRoles.slice(0, -1).map(
                (role, i) =>
                  `  - from: ${role.display_name}\n    to: ${selectedRoles[i + 1].display_name}\n    mode: ${state.governanceMode}\n    protocol: A2A\n\n`
              )}
            </pre>
          </div>
        </motion.div>
      </div>

      {/* Deploy CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDeployPhase("deploying")}
          className="relative group cursor-pointer"
        >
          {/* Animated glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-2xl blur-2xl"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="relative glass-card px-10 py-5 flex items-center gap-3 text-white bg-gradient-to-r from-[var(--accent-purple)]/15 to-[var(--accent-cyan)]/15">
            <Rocket size={20} />
            <span className="font-bold text-lg">Deploy to Kestrel</span>
            <Play size={16} className="ml-1" />
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
