"use client";

import { motion } from "framer-motion";
import { ROLES, VERTICALS } from "@/lib/roles";
import { useTeam } from "@/lib/store";
import { RoleIcon } from "./RoleIcon";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Workflow,
} from "lucide-react";

const stageAccents: Record<number, string> = {
  1: "#4361ee",
  2: "#f59e0b",
  3: "#7b2ff7",
  4: "#00d4ff",
  5: "#00c896",
};

function DataFlowLine({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex-1 relative h-[2px] mx-1 min-w-[40px]">
      {/* Base line */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-purple)]/30 to-[var(--accent-cyan)]/30 rounded-full" />
      {/* Glow */}
      <div className="absolute inset-y-[-2px] inset-x-0 bg-gradient-to-r from-[var(--accent-purple)]/10 to-[var(--accent-cyan)]/10 blur-[3px] rounded-full" />
      {/* Animated particles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{
            background: i === 0 ? "var(--accent-purple)" : i === 1 ? "var(--accent-blue)" : "var(--accent-cyan)",
            boxShadow: `0 0 8px ${i === 0 ? "var(--accent-purple)" : i === 1 ? "var(--accent-blue)" : "var(--accent-cyan)"}`,
          }}
          animate={{
            left: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: delay + i * 0.6,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function TollgateNode({ mode, delay }: { mode: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center gap-1.5 mx-1"
    >
      <motion.div
        className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center relative"
        whileHover={{ scale: 1.15, rotate: 5 }}
        animate={{
          boxShadow: mode === "enforced"
            ? ["0 0 0px rgba(230,57,70,0)", "0 0 20px rgba(230,57,70,0.3)", "0 0 0px rgba(230,57,70,0)"]
            : ["0 0 0px rgba(245,158,11,0)", "0 0 20px rgba(245,158,11,0.3)", "0 0 0px rgba(245,158,11,0)"],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {mode === "enforced" ? (
          <Shield size={16} className="text-red-400" />
        ) : (
          <AlertTriangle size={16} className="text-amber-400" />
        )}
        {/* Scan line */}
        <div className="scan-line" />
      </motion.div>
      <span className="text-[8px] text-white/30 font-mono uppercase tracking-wider">
        Tollgate
      </span>
    </motion.div>
  );
}

export function ComposerView() {
  const { state, dispatch } = useTeam();
  const selectedRoles = ROLES.filter((r) =>
    state.selectedRoles.includes(r.role_id)
  ).sort((a, b) => a.stage_order - b.stage_order);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Workflow size={14} className="text-[var(--accent-purple)]" />
          <span className="text-[10px] font-mono text-white/25 uppercase tracking-[0.3em]">
            Wire Your Team
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white/90">Arc Composer</h1>
        <p className="text-white/35 text-sm">
          Configure tollgates, verticals, and governance mode.
        </p>
      </motion.div>

      {/* Configuration Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex flex-wrap items-start gap-10">
          {/* Vertical Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Industry Vertical
            </label>
            <div className="flex gap-2">
              {VERTICALS.map((v, i) => (
                <motion.button
                  key={v.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    dispatch({ type: "SET_VERTICAL", vertical: v.id })
                  }
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    state.vertical === v.id
                      ? "text-white"
                      : "text-white/30 hover:text-white/60"
                  }`}
                  style={{
                    background:
                      state.vertical === v.id
                        ? `${v.color}18`
                        : "rgba(255,255,255,0.02)",
                    border: `1px solid ${state.vertical === v.id ? `${v.color}35` : "rgba(255,255,255,0.04)"}`,
                    boxShadow: state.vertical === v.id ? `0 0 20px ${v.color}15` : "none",
                  }}
                >
                  <RoleIcon name={v.icon} size={14} />
                  {v.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Governance Mode */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Governance Mode
            </label>
            <div className="flex gap-2">
              {(["enforced", "advisory"] as const).map((mode) => {
                const isActive = state.governanceMode === mode;
                const color = mode === "enforced" ? "#e63946" : "#f59e0b";
                return (
                  <motion.button
                    key={mode}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => dispatch({ type: "SET_GOVERNANCE", mode })}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      isActive ? "text-white" : "text-white/30 hover:text-white/60"
                    }`}
                    style={{
                      background: isActive ? `${color}15` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isActive ? `${color}30` : "rgba(255,255,255,0.04)"}`,
                      boxShadow: isActive ? `0 0 20px ${color}15` : "none",
                    }}
                  >
                    {mode === "enforced" ? <Shield size={14} /> : <AlertTriangle size={14} />}
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Wiring Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 relative overflow-hidden"
      >
        {/* Background scan line */}
        <div className="scan-line" style={{ animationDuration: "5s" }} />

        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] pulse-dot" />
          <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            Workflow Pipeline · {selectedRoles.length} Stages
          </h2>
        </div>

        <div className="flex items-center">
          {selectedRoles.map((role, i) => {
            const accent = stageAccents[role.stage_order];
            const isLast = i === selectedRoles.length - 1;

            return (
              <div key={role.role_id} className="flex items-center flex-1 min-w-0">
                {/* Role Node */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: 0.4 + i * 0.15,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="glass-subtle p-5 flex-1 relative group cursor-default min-w-0"
                  style={{ borderColor: `${accent}20` }}
                >
                  {/* Stage pill */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                    className="absolute -top-3 left-4 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: accent,
                      color: "white",
                      boxShadow: `0 0 15px ${accent}50`,
                    }}
                  >
                    S{role.stage_order}
                  </motion.div>

                  <div className="flex items-center gap-3 mb-3 mt-1">
                    <motion.div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${accent}12` }}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <RoleIcon name={role.icon} size={20} />
                    </motion.div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white/90 text-sm truncate">
                        {role.display_name}
                      </div>
                      <div className="text-[10px] text-white/25 font-mono truncate">
                        {role.stage_name}
                      </div>
                    </div>
                  </div>

                  {/* Artifacts */}
                  {role.delivers_to.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <div className="text-[9px] text-white/25 uppercase tracking-wider font-mono">
                        Delivers
                      </div>
                      {role.delivers_to
                        .filter((d) =>
                          state.selectedRoles.includes(`lumi-${d.role}`)
                        )
                        .map((d, di) => (
                          <motion.div
                            key={d.artifact}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + i * 0.15 + di * 0.05 }}
                            className="text-[11px] text-white/40 flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={10} style={{ color: accent }} />
                            <span className="truncate">{d.artifact}</span>
                          </motion.div>
                        ))}
                    </div>
                  )}
                </motion.div>

                {/* Tollgate + Data Flow */}
                {!isLast && (
                  <div className="flex items-center shrink-0">
                    <DataFlowLine delay={i * 0.5} />
                    <TollgateNode mode={state.governanceMode} delay={0.6 + i * 0.15} />
                    <DataFlowLine delay={i * 0.5 + 0.3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Proceed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch({ type: "SET_VIEW", view: "deploy" })}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-opacity" />
          <div className="relative glass-card px-8 py-4 flex items-center gap-3 text-white">
            <span className="font-semibold">Generate Execution Plan</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
