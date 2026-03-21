"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Layers,
  Zap,
  BarChart3,
  GitBranch,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Users,
  Cpu,
  Database,
  Eye,
  Plug,
  MessageSquare,
  DollarSign,
  Clock,
  TrendingDown,
  Settings,
  Globe,
  Activity,
  ChevronRight,
} from "lucide-react";

// ─── Animation Presets ───────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const fadeUpDelay = (delay: number) => ({
  ...fadeUp,
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

// ─── Shared Styles ───────────────────────────────────────────────────────────

const ORANGE = "#FF6B2C";
const DARK = "#0a0a0f";
const LIGHT_GREY = "#fafafa";

const sectionPadding: React.CSSProperties = {
  padding: "100px 24px",
};

const container: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  width: "100%",
};

const sectionLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: ORANGE,
  marginBottom: 16,
};

const sectionTitle: React.CSSProperties = {
  fontSize: "clamp(28px, 4vw, 42px)",
  fontWeight: 700,
  lineHeight: 1.15,
  marginBottom: 20,
};

const sectionDesc: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1.65,
  maxWidth: 680,
};

// ─── Page Component ──────────────────────────────────────────────────────────

export default function PitchPage() {
  return (
    <div
      style={{
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        color: "#1a1a1e",
        background: "#fff",
        overflowX: "hidden",
      }}
    >
      {/* ── Minimal Header ──────────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(10,10,15,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            ...container,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 56,
            padding: "0 24px",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.04em",
            }}
          >
            LUMI AI
          </span>
          <a
            href="/"
            style={{
              fontSize: 13,
              color: ORANGE,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 500,
            }}
          >
            View Live Demo <ArrowRight size={14} />
          </a>
        </div>
      </header>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          ...sectionPadding,
          paddingTop: 160,
          paddingBottom: 120,
          background: DARK,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating dots */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                width: 2,
                height: 2,
                borderRadius: "50%",
                background: `rgba(255,107,44,${0.15 + Math.random() * 0.2})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20 - Math.random() * 30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div style={{ ...container, position: "relative", textAlign: "center" }}>
          <motion.p
            {...fadeUp}
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Lumi AI presents
          </motion.p>

          <motion.h1
            {...fadeUpDelay(0.1)}
            style={{
              fontSize: "clamp(48px, 7vw, 80px)",
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 24,
              background: `linear-gradient(135deg, #fff 30%, ${ORANGE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            KESTREL SYMPHONY
          </motion.h1>

          <motion.p
            {...fadeUpDelay(0.2)}
            style={{
              fontSize: "clamp(18px, 2.5vw, 24px)",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 400,
              marginBottom: 32,
              letterSpacing: "0.02em",
            }}
          >
            AI-Native SDLC Orchestration
          </motion.p>

          <motion.p
            {...fadeUpDelay(0.3)}
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              maxWidth: 620,
              margin: "0 auto 48px",
            }}
          >
            The governed layer between your backlog and your AI agent teams.
            Replace $5-20M outsourced development with orchestrated AI agents
            that deliver faster, cheaper, and with built-in governance.
          </motion.p>

          <motion.div
            {...fadeUpDelay(0.4)}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                background: ORANGE,
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              View Live Demo <ArrowRight size={16} />
            </a>
            <a
              href="https://lumicorp.ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Contact Us <ChevronRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── 2. THE PROBLEM ──────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "#fff" }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            The Problem
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.1)}
            style={{ ...sectionTitle, color: "#1a1a1e", marginBottom: 48 }}
          >
            Enterprise software delivery is broken
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              marginBottom: 64,
            }}
          >
            {[
              {
                icon: <DollarSign size={24} />,
                stat: "$5-20M / year",
                desc: "on outsourced dev teams that are slow, expensive, and hard to manage",
              },
              {
                icon: <Clock size={24} />,
                stat: "8-12 week cycles",
                desc: "from ticket to production with traditional teams and handoff delays",
              },
              {
                icon: <AlertTriangle size={24} />,
                stat: "Zero governance",
                desc: "over AI tool usage across engineering teams, creating risk and inconsistency",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ ...stagger.transition, delay: i * 0.12 }}
                style={{
                  padding: 36,
                  border: "1px solid #e8e8ec",
                  borderRadius: 12,
                  background: "#fff",
                }}
              >
                <div style={{ color: ORANGE, marginBottom: 16 }}>{item.icon}</div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#1a1a1e",
                    marginBottom: 10,
                  }}
                >
                  {item.stat}
                </div>
                <p style={{ fontSize: 15, color: "#6b6b76", lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            {...fadeUp}
            style={{
              borderLeft: `3px solid ${ORANGE}`,
              paddingLeft: 24,
              fontSize: 20,
              fontWeight: 500,
              color: "#1a1a1e",
              lineHeight: 1.6,
              maxWidth: 640,
            }}
          >
            Today you buy AI productivity per developer.
            <br />
            With Symphony, you buy AI productivity <em>per team</em>.
          </motion.blockquote>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ─────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: LIGHT_GREY }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            The Solution
          </motion.p>
          <motion.h2 {...fadeUpDelay(0.1)} style={{ ...sectionTitle, color: "#1a1a1e" }}>
            From backlog to production, orchestrated
          </motion.h2>
          <motion.p
            {...fadeUpDelay(0.15)}
            style={{ ...sectionDesc, color: "#6b6b76", marginBottom: 56 }}
          >
            Symphony transforms Jira stories into governed, multi-agent build sessions
            with human-in-the-loop tollgates at every phase.
          </motion.p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0,
              alignItems: "flex-start",
            }}
          >
            {[
              { label: "Jira Board", sub: "Story intake", icon: <FileText size={20} /> },
              { label: "Blueprint", sub: "AI-generated spec", icon: <Layers size={20} /> },
              { label: "Plan Session", sub: "Architecture + tasks", icon: <GitBranch size={20} /> },
              { label: "Tollgate", sub: "Quality gate", icon: <Shield size={20} />, isTollgate: true },
              { label: "Build Session", sub: "Multi-agent execution", icon: <Cpu size={20} /> },
              { label: "Tollgate", sub: "Code review gate", icon: <Shield size={20} />, isTollgate: true },
              { label: "Deploy", sub: "CI/CD + staging", icon: <Zap size={20} /> },
              { label: "Tollgate", sub: "Release gate", icon: <Shield size={20} />, isTollgate: true },
              { label: "Cockpit", sub: "Observability", icon: <Activity size={20} /> },
            ].map((step, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ ...stagger.transition, delay: i * 0.06 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: step.isTollgate ? 100 : 120,
                    textAlign: "center",
                    padding: "16px 8px",
                    background: step.isTollgate ? "rgba(255,107,44,0.08)" : "#fff",
                    border: step.isTollgate
                      ? `1.5px solid ${ORANGE}`
                      : "1px solid #e8e8ec",
                    borderRadius: step.isTollgate ? 24 : 10,
                  }}
                >
                  <div
                    style={{
                      color: step.isTollgate ? ORANGE : "#1a1a1e",
                      marginBottom: 6,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: step.isTollgate ? ORANGE : "#1a1a1e",
                    }}
                  >
                    {step.label}
                  </div>
                  <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{step.sub}</div>
                </div>
                {i < 8 && (
                  <div style={{ padding: "0 4px", color: "#ccc", fontSize: 14 }}>
                    <ChevronRight size={14} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. THREE-LAYER ARCHITECTURE ──────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "#fff" }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            Architecture
          </motion.p>
          <motion.h2 {...fadeUpDelay(0.1)} style={{ ...sectionTitle, color: "#1a1a1e" }}>
            Three-layer composable platform
          </motion.h2>
          <motion.p
            {...fadeUpDelay(0.15)}
            style={{ ...sectionDesc, color: "#6b6b76", marginBottom: 56 }}
          >
            Each layer is independent. Swap engines, add roles, or customize
            governance without touching the layers above or below.
          </motion.p>

          <div style={{ display: "flex", flexDirection: "column", gap: 2, borderRadius: 16, overflow: "hidden" }}>
            {/* Layer 3 */}
            <motion.div
              {...fadeUpDelay(0.1)}
              style={{
                background: "#1a1a1e",
                color: "#fff",
                padding: "40px 36px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                    LAYER 3
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Kestrel Runtime</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                    The enterprise platform layer
                  </p>
                </div>
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                  {["Deployment management", "Cost tracking per story", "Immutable audit logs", "Enterprise admin controls"].map(
                    (c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                        <CheckCircle2 size={14} style={{ color: ORANGE }} />
                        {c}
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>

            {/* Layer 2 */}
            <motion.div
              {...fadeUpDelay(0.2)}
              style={{
                background: "rgba(255,107,44,0.06)",
                padding: "40px 36px",
                borderLeft: `3px solid ${ORANGE}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", color: ORANGE, marginBottom: 8 }}>
                    LAYER 2
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1e", marginBottom: 6 }}>
                    Arc Composer
                  </h3>
                  <p style={{ fontSize: 14, color: "#6b6b76" }}>
                    Tollgated workflow engine &mdash; &quot;Define it. Arc builds it.&quot;
                  </p>
                </div>
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                  {["Phase-tollgate sequencing", "Weighted quality criteria", "Advisory + enforced modes", "Industry presets"].map(
                    (c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555" }}>
                        <CheckCircle2 size={14} style={{ color: ORANGE }} />
                        {c}
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>

            {/* Layer 1 */}
            <motion.div
              {...fadeUpDelay(0.3)}
              style={{
                background: "#f5f5f7",
                padding: "40px 36px",
              }}
            >
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#999", marginBottom: 8 }}>
                  LAYER 1
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1e", marginBottom: 6 }}>
                  Role Cards
                </h3>
                <p style={{ fontSize: 14, color: "#6b6b76", marginBottom: 20 }}>
                  The agent catalog &mdash; each role is a standalone, composable plugin
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                {[
                  "Requirements Dev",
                  "Process Leader",
                  "Agent Engineer",
                  "Code Auditor",
                  "Agent Ops",
                  "Data Steward",
                ].map((role, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "14px 16px",
                      background: "#fff",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1a1a1e",
                      border: "1px solid #e8e8ec",
                    }}
                  >
                    {role}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5. ENGINE-AGNOSTIC ──────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "#fff" }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            Interoperability
          </motion.p>
          <motion.h2 {...fadeUpDelay(0.1)} style={{ ...sectionTitle, color: "#1a1a1e" }}>
            Engine-agnostic by design
          </motion.h2>
          <motion.p
            {...fadeUpDelay(0.15)}
            style={{ ...sectionDesc, color: "#6b6b76", marginBottom: 56 }}
          >
            Symphony uses open protocols so every layer is swappable.
            No vendor lock-in at any level of the stack.
          </motion.p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "start",
            }}
          >
            {/* Protocol Stack */}
            <motion.div {...fadeUpDelay(0.15)}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  {
                    label: "Your Tools",
                    items: "GitHub, Jira, Confluence, Snyk...",
                    protocol: "MCP (Model Context Protocol)",
                    icon: <Plug size={18} />,
                  },
                  {
                    label: "Your Agents",
                    items: "Requirements Dev, Code Auditor...",
                    protocol: "A2A (Agent-to-Agent Protocol)",
                    icon: <Users size={18} />,
                  },
                  {
                    label: "Your Engine",
                    items: "CrewAI / LangGraph / AutoGen",
                    protocol: null,
                    icon: <Settings size={18} />,
                  },
                  {
                    label: "Your LLMs",
                    items: "Claude / GPT / Gemini / Llama",
                    protocol: null,
                    icon: <Cpu size={18} />,
                  },
                ].map((row, i) => (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "16px 20px",
                        background: "#f5f5f7",
                        borderRadius: 10,
                        border: "1px solid #e8e8ec",
                      }}
                    >
                      <div style={{ color: ORANGE }}>{row.icon}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1e" }}>
                          {row.label}
                        </div>
                        <div style={{ fontSize: 12, color: "#999" }}>{row.items}</div>
                      </div>
                    </div>
                    {row.protocol && (
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: 11,
                          color: ORANGE,
                          fontWeight: 600,
                          padding: "6px 0",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {row.protocol}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Comparison Table */}
            <motion.div {...fadeUpDelay(0.25)}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "2px solid #e8e8ec" }}>
                    <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, color: "#1a1a1e" }}>
                      Capability
                    </th>
                    <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, color: ORANGE }}>
                      Symphony
                    </th>
                    <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, color: "#999" }}>
                      DIY
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Engine choice", "Any (CrewAI, LangGraph, AutoGen)", "Locked in"],
                    ["LLM routing", "Per-role optimization", "One model fits all"],
                    ["Tool integration", "MCP standard", "Custom adapters"],
                    ["Governance", "Arc tollgates", "Manual reviews"],
                    ["Cost tracking", "Per-story, per-role", "Unknown"],
                  ].map(([cap, sym, diy], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f2" }}>
                      <td style={{ padding: "12px 16px", color: "#1a1a1e", fontWeight: 500 }}>
                        {cap}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#333" }}>{sym}</td>
                      <td style={{ padding: "12px 16px", color: "#999" }}>{diy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. GOVERNANCE / ARC ──────────────────────────────────────────── */}
      <section
        style={{
          ...sectionPadding,
          background: DARK,
          color: "#fff",
        }}
      >
        <div style={container}>
          <motion.p {...fadeUp} style={{ ...sectionLabel }}>
            Governance
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.1)}
            style={{ ...sectionTitle, color: "#fff", marginBottom: 12 }}
          >
            Powered by Arc Tollgates
          </motion.h2>
          <motion.p
            {...fadeUpDelay(0.15)}
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 56,
              maxWidth: 540,
              lineHeight: 1.6,
            }}
          >
            Every phase transition is earned, not assumed. Arc ensures quality,
            compliance, and auditability at every step.
          </motion.p>

          {/* Tollgate flow */}
          <motion.div
            {...fadeUpDelay(0.2)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 56,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { label: "Plan", phase: true },
              { label: "Pass / Fail", phase: false },
              { label: "Build", phase: true },
              { label: "Pass / Fail", phase: false },
              { label: "Deploy", phase: true },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    padding: s.phase ? "14px 28px" : "10px 18px",
                    borderRadius: s.phase ? 10 : 20,
                    background: s.phase
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,107,44,0.12)",
                    border: s.phase
                      ? "1px solid rgba(255,255,255,0.1)"
                      : `1px solid rgba(255,107,44,0.3)`,
                    fontSize: s.phase ? 14 : 12,
                    fontWeight: 600,
                    color: s.phase ? "#fff" : ORANGE,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {!s.phase && <Shield size={12} />}
                  {s.label}
                </div>
                {i < 4 && (
                  <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                )}
              </div>
            ))}
          </motion.div>

          {/* Mode cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
              marginBottom: 48,
            }}
          >
            {[
              {
                mode: "Enforced",
                desc: "Failures block the pipeline. Nothing passes without meeting criteria.",
                icon: <XCircle size={20} />,
                color: "#f87171",
              },
              {
                mode: "Advisory",
                desc: "Failures warn but allow continuation. Ideal for early adoption.",
                icon: <AlertTriangle size={20} />,
                color: "#fbbf24",
              },
              {
                mode: "Override",
                desc: "Requires justification and creates an immutable audit trail entry.",
                icon: <Lock size={20} />,
                color: ORANGE,
              },
            ].map((m, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ ...stagger.transition, delay: i * 0.1 }}
                style={{
                  padding: 28,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                }}
              >
                <div style={{ color: m.color, marginBottom: 12 }}>{m.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{m.mode} Mode</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Governance features */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {[
              "Weighted criteria per phase",
              "Customizable pass thresholds",
              "Industry presets (Healthcare, FinServ, Gov)",
              "Immutable audit trail",
              "Override with justification",
              "Auto-escalation after 2 retries",
            ].map((feat, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ ...stagger.transition, delay: 0.3 + i * 0.05 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                  padding: "10px 0",
                }}
              >
                <CheckCircle2 size={14} style={{ color: ORANGE, flexShrink: 0 }} />
                {feat}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ROI ──────────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "#fff" }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            Return on Investment
          </motion.p>
          <motion.h2 {...fadeUpDelay(0.1)} style={{ ...sectionTitle, color: "#1a1a1e", marginBottom: 48 }}>
            Conservative estimates, real impact
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
              marginBottom: 64,
            }}
          >
            {[
              { stat: "60%", label: "Time Saved", desc: "vs traditional dev cycles" },
              { stat: "60%", label: "Cost Saved", desc: "vs outsourced team costs" },
              { stat: "8 weeks", label: "To Production", desc: "from concept to deployed agents" },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ ...stagger.transition, delay: i * 0.12 }}
                style={{
                  padding: 40,
                  textAlign: "center",
                  border: "1px solid #e8e8ec",
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: ORANGE,
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {item.stat}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1e", marginBottom: 4 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 14, color: "#999" }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            style={{
              background: "#f9f9fb",
              borderRadius: 16,
              padding: 40,
              border: "1px solid #e8e8ec",
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1e", marginBottom: 20 }}>
              How the math works
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
                fontSize: 15,
                lineHeight: 1.7,
                color: "#555",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: "#1a1a1e", marginBottom: 8 }}>
                  Symphony Cost Per Story
                </div>
                <p>
                  AI compute: $8-15 per story. Platform license: predictable monthly fee.
                  Human oversight: ~30 min per story at senior engineer rate. Total: a fraction
                  of the traditional cost.
                </p>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "#1a1a1e", marginBottom: 8 }}>
                  Traditional Cost Per Story
                </div>
                <p>
                  Fully-loaded developer cost: $150-250K/year. At ~200 stories/year, that is
                  $750-1,250 per story. Multiply by team size and add management overhead.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 8. TECH STACK ──────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: LIGHT_GREY }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            Tech Stack
          </motion.p>
          <motion.h2 {...fadeUpDelay(0.1)} style={{ ...sectionTitle, color: "#1a1a1e", marginBottom: 48 }}>
            Built on proven foundations
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                name: "Claude (Anthropic)",
                desc: "Primary LLM for reasoning and code generation. Sonnet 4 default, Opus 4.6 for complex reasoning.",
                icon: <Cpu size={20} />,
              },
              {
                name: "CrewAI Flows",
                desc: "Default orchestration engine for multi-agent team execution. Swappable via engine-agnostic design.",
                icon: <GitBranch size={20} />,
              },
              {
                name: "Supabase",
                desc: "PostgreSQL + pgvector + PostGIS. Database, auth, and real-time subscriptions.",
                icon: <Database size={20} />,
              },
              {
                name: "MCP Protocol",
                desc: "Model Context Protocol for standardized tool integration. GitHub, Jira, Confluence, and more.",
                icon: <Plug size={20} />,
              },
              {
                name: "A2A Protocol",
                desc: "Agent-to-Agent communication standard. Enables cross-role coordination and data exchange.",
                icon: <MessageSquare size={20} />,
              },
              {
                name: "Langfuse",
                desc: "Observability and tracing for every agent action. Cost tracking, latency metrics, and debugging.",
                icon: <Eye size={20} />,
              },
            ].map((tech, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ ...stagger.transition, delay: i * 0.08 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: 24,
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #e8e8ec",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "rgba(255,107,44,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: ORANGE,
                    flexShrink: 0,
                  }}
                >
                  {tech.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1e", marginBottom: 4 }}>
                    {tech.name}
                  </div>
                  <div style={{ fontSize: 13, color: "#6b6b76", lineHeight: 1.55 }}>
                    {tech.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FOOTER ──────────────────────────────────────────────────── */}
      <footer
        style={{
          background: DARK,
          color: "#fff",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <div style={container}>
          <motion.div {...fadeUp}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, letterSpacing: "0.04em" }}>
              Lumi AI
            </div>
            <a
              href="https://lumicorp.ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, color: ORANGE, textDecoration: "none" }}
            >
              lumicorp.ai
            </a>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.45)",
                marginTop: 16,
                marginBottom: 32,
                fontStyle: "italic",
              }}
            >
              Builders not consultants &mdash; AI agents to production in 8 weeks
            </p>

            <div
              style={{
                display: "flex",
                gap: 24,
                justifyContent: "center",
                marginBottom: 40,
              }}
            >
              {[
                { label: "View Live Demo", href: "/" },
                { label: "GitHub", href: "https://github.com/lumicorp" },
                { label: "Contact", href: "https://lumicorp.ai" },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.25)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: 24,
              }}
            >
              Confidential &middot; Demo Build v0.5
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
