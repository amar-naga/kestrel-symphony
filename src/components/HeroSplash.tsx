"use client";

import { motion } from "framer-motion";
import { useTeam } from "@/lib/store";
import { ArrowRight, Layers, GitBranch, Rocket, Gauge } from "lucide-react";

export function HeroSplash() {
  const { dispatch } = useTeam();

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center relative pt-24">
      {/* Central glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(123, 47, 247, 0.2) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo mark */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-8"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--accent-purple)] via-[var(--accent-blue)] to-[var(--accent-cyan)] flex items-center justify-center shadow-2xl overflow-hidden p-1.5">
          <img
            src="/kestrel-logo.png"
            alt="Kestrel"
            className="w-full h-full object-contain brightness-0 invert"
          />
        </div>
        {/* Orbiting dots */}
        <motion.div
          className="absolute -inset-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-[var(--accent-purple)] -translate-x-1/2 -translate-y-1" />
        </motion.div>
        <motion.div
          className="absolute -inset-6"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] -translate-x-1/2 -translate-y-0.5" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-center space-y-4 relative z-10"
      >
        <h1 className="text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent">
            Kestrel{" "}
          </span>
          <span className="bg-gradient-to-r from-[var(--accent-purple)] via-[var(--accent-blue)] to-[var(--accent-cyan)] bg-clip-text text-transparent">
            Symphony
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xl text-white/50 font-medium tracking-wide"
        >
          Define it. <span className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] bg-clip-text text-transparent font-semibold">Arc builds it.</span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm text-white/30 max-w-lg mx-auto leading-relaxed"
        >
          Compose AI agent teams. Wire them through tollgated workflows.
          Deploy on any engine.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-xs text-white/20 font-mono"
        >
          Engine-agnostic · MCP + A2A protocols · Arc governance
        </motion.p>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => dispatch({ type: "SET_VIEW", view: "catalog" })}
        className="mt-10 relative group cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
        <div className="relative glass-card px-8 py-4 flex items-center gap-3 text-white">
          <span className="font-semibold">Open Role Catalog</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.button>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="mt-16 flex items-center gap-4"
      >
        {[
          { icon: Layers, label: "Role Catalog", desc: "4 core roles" },
          { icon: GitBranch, label: "Arc Composer", desc: "Tollgated flows" },
          { icon: Rocket, label: "Multi-Engine", desc: "CrewAI · LangGraph · AutoGen" },
          { icon: Gauge, label: "Live Cockpit", desc: "Token spend & quality" },
        ].map((feat, i) => (
          <motion.div
            key={feat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 + i * 0.1 }}
            className="glass-subtle px-4 py-3 flex items-center gap-3 group hover:bg-white/[0.04] transition-colors"
          >
            <feat.icon size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
            <div>
              <div className="text-xs font-medium text-white/60">{feat.label}</div>
              <div className="text-[10px] text-white/25">{feat.desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom brand */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="mt-16 text-[11px] text-white/15 font-mono tracking-widest"
      >
        LUMICORP AI · BUILDERS NOT CONSULTANTS
      </motion.div>
    </div>
  );
}
