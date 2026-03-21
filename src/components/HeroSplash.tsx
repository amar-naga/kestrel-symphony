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
            {/* Orbiting dots */}
            {[
              { size: 120, duration: 8, dotSize: 6, color: "#FF6B2C", opacity: 0.9, delay: 0 },
              { size: 120, duration: 8, dotSize: 4, color: "#FF8F5C", opacity: 0.6, delay: 2.5 },
              { size: 150, duration: 12, dotSize: 5, color: "#FF6B2C", opacity: 0.7, delay: 1 },
              { size: 150, duration: 12, dotSize: 3, color: "#CC5623", opacity: 0.5, delay: 4 },
              { size: 100, duration: 6, dotSize: 4, color: "#FF8F5C", opacity: 0.8, delay: 0.5 },
              { size: 100, duration: 6, dotSize: 3, color: "#FF6B2C", opacity: 0.4, delay: 3 },
            ].map((orbit, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: orbit.dotSize,
                  height: orbit.dotSize,
                  background: orbit.color,
                  opacity: orbit.opacity,
                  boxShadow: `0 0 ${orbit.dotSize * 2}px ${orbit.color}`,
                  top: "50%",
                  left: "50%",
                  marginTop: -orbit.dotSize / 2,
                  marginLeft: -orbit.dotSize / 2,
                }}
                animate={{
                  x: [
                    Math.cos(0) * orbit.size / 2,
                    Math.cos(Math.PI / 2) * orbit.size / 2,
                    Math.cos(Math.PI) * orbit.size / 2,
                    Math.cos(3 * Math.PI / 2) * orbit.size / 2,
                    Math.cos(2 * Math.PI) * orbit.size / 2,
                  ],
                  y: [
                    Math.sin(0) * orbit.size / 2,
                    Math.sin(Math.PI / 2) * orbit.size / 2,
                    Math.sin(Math.PI) * orbit.size / 2,
                    Math.sin(3 * Math.PI / 2) * orbit.size / 2,
                    Math.sin(2 * Math.PI) * orbit.size / 2,
                  ],
                }}
                transition={{
                  duration: orbit.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: orbit.delay,
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
              className="glass-subtle px-3 py-1.5 text-[11px] font-mono text-white/30 tracking-wide"
            >
              {badge}
            </span>
          ))}
        </motion.div>

        {/* Enter Demo button with glow pulse */}
        <motion.div variants={fadeUp} className="mt-12">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => dispatch({ type: "SET_VIEW", view: "board" })}
            className="relative group cursor-pointer"
          >
            {/* Glow pulse behind button */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#FF6B2C] to-[#FF8F5C] rounded-2xl blur-xl"
              animate={{
                opacity: [0.3, 0.55, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative glass-card px-8 py-4 flex items-center gap-3 text-white shimmer-effect">
              <span className="font-semibold tracking-wide">Enter Demo</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </motion.button>
        </motion.div>

        {/* Bottom brand */}
        <motion.div
          variants={fadeUp}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-[11px] text-white/20 tracking-wide">
            by{" "}
            <span className="text-white/30 font-medium">Lumicorp AI</span>
            {" "}
            <span className="text-white/15">·</span>
            {" "}
            <span className="text-white/20 font-mono">lumicorp.ai</span>
          </span>
          <span className="text-[9px] font-mono tracking-[0.25em] text-white/10 uppercase px-3 py-1 border border-white/[0.06] rounded">
            Confidential
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
