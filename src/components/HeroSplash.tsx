"use client";

import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import { ArrowRight, Shield, Cpu, Users } from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const VALUE_PROPS = [
  {
    icon: Users,
    title: "10x Team Productivity",
    description:
      "Not just individual. Orchestrate your entire engineering team with AI agents.",
  },
  {
    icon: Shield,
    title: "Governed by Default",
    description:
      "Tollgated phases. Audit trails. Enforced quality gates between every transition.",
  },
  {
    icon: Cpu,
    title: "Engine Agnostic",
    description:
      "CrewAI, LangGraph, AutoGen. Pick your runtime. Symphony orchestrates.",
  },
];

const TECH_BADGES = ["Claude", "CrewAI", "Supabase", "MCP", "A2A", "Langfuse"];

export function HeroSplash() {
  const { dispatch } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative py-24 px-6">
      {/* Background ambient glow */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 107, 44, 0.15) 0%, rgba(255, 143, 92, 0.08) 40%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.65, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center"
      >
        {/* Logo with float animation + orbiting dots */}
        <motion.div variants={fadeUp} className="mb-10">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* Slow floating dots — drift down from top, arc around, float back up */}
            {[
              { dotSize: 5, color: "#FF6B2C", opacity: 0.85, duration: 14, delay: 0,
                x: [20, 50, 30, -40, -50, -20, 20],
                y: [-70, -30, 20, 30, -10, -50, -70] },
              { dotSize: 4, color: "#FF8F5C", opacity: 0.6, duration: 18, delay: 3,
                x: [-30, -50, -20, 40, 55, 25, -30],
                y: [-65, -15, 35, 20, -25, -55, -65] },
              { dotSize: 3, color: "#FF6B2C", opacity: 0.45, duration: 16, delay: 6,
                x: [45, 15, -35, -45, -10, 35, 45],
                y: [-60, -20, 10, -15, -45, -55, -60] },
            ].map((dot, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: dot.dotSize,
                  height: dot.dotSize,
                  background: dot.color,
                  opacity: dot.opacity,
                  boxShadow: `0 0 ${dot.dotSize * 3}px ${dot.color}60`,
                  top: "50%",
                  left: "50%",
                  marginTop: -dot.dotSize / 2,
                  marginLeft: -dot.dotSize / 2,
                }}
                animate={{ x: dot.x, y: dot.y }}
                transition={{
                  duration: dot.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: dot.delay,
                }}
              />
            ))}

            {/* Logo */}
            <div className="relative z-10 w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FF6B2C] via-[#FF8F5C] to-[#CC5623] flex items-center justify-center shadow-2xl overflow-hidden p-1.5">
              <img
                src="/kestrel-logo.png"
                alt="Kestrel Symphony"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight"
        >
          <span className="hero-headline-text">
            AI-Native SDLC
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#FF6B2C] via-[#FF8F5C] to-[#CC5623] bg-clip-text text-transparent">
            Orchestration
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="mt-6 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed hero-sub-text"
        >
          The governed layer between your backlog and your AI tools.
        </motion.p>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="mt-4 text-sm sm:text-base text-white/30 italic max-w-xl leading-relaxed"
        >
          Today you buy AI productivity per developer. With Symphony, you buy AI
          productivity per team.
        </motion.p>

        {/* Value prop cards */}
        <motion.div
          variants={fadeUp}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
        >
          {VALUE_PROPS.map((prop) => (
            <div
              key={prop.title}
              className="glass-card p-6 text-left space-y-3 hover:bg-white/[0.04] transition-colors"
            >
              <prop.icon
                size={20}
                className="text-white/40"
                strokeWidth={1.5}
              />
              <h3 className="text-sm font-semibold text-white/80 tracking-wide">
                {prop.title}
              </h3>
              <p className="text-xs text-white/35 leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Tech stack badges */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {TECH_BADGES.map((badge) => (
            <span
              key={badge}
              className="px-3 py-1.5 rounded-xl text-[11px] font-mono tracking-wide"
              style={{
                background: "var(--surface-primary)",
                border: "1px solid var(--border-secondary)",
                color: "var(--text-faint)",
              }}
            >
              {badge}
            </span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div variants={fadeUp} className="mt-12 flex items-center gap-4 flex-wrap justify-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => dispatch({ type: "SET_VIEW", view: "board" })}
            className="relative group cursor-pointer"
          >
            <div
              className="relative px-8 py-4 rounded-2xl flex items-center gap-3 font-semibold tracking-wide"
              style={{
                background: "linear-gradient(135deg, #FF6B2C, #CC5623)",
                color: "#ffffff",
                boxShadow: "0 4px 20px rgba(255,107,44,0.3)",
              }}
            >
              Enter Demo
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </motion.button>

          <motion.a
            href="/pitch"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative group cursor-pointer"
            style={{ textDecoration: "none" }}
          >
            <div
              className="relative px-8 py-4 rounded-2xl flex items-center gap-3 font-semibold tracking-wide text-sm"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              About Symphony
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
                style={{ opacity: 0.6 }}
              />
            </div>
          </motion.a>
        </motion.div>

        {/* Bottom brand */}
        <motion.div
          variants={fadeUp}
          className="mt-16 flex flex-col items-center gap-3"
        >
          <span className="text-[11px] tracking-wide" style={{ color: "var(--text-faint)" }}>
            by{" "}
            <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Lumi AI</span>
            {" · "}
            <span className="font-mono" style={{ color: "var(--text-faint)" }}>lumicorp.ai</span>
          </span>
          <span
            className="text-[9px] font-mono tracking-[0.25em] uppercase px-3 py-1 rounded"
            style={{
              color: "var(--text-ghost)",
              border: "1px solid var(--border-secondary)",
            }}
          >
            Confidential · Demo Build v0.5
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
