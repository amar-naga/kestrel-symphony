"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Layers,
  Zap,
  CheckCircle2,
  XCircle,
  FileText,
  Users,
  Cpu,
  Eye,
  Plug,
  Settings,
  Activity,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Brain,
  BarChart3,
  Clock,
  Check,
  X,
  Minus,
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
          <img
            src="/lumi-logo-white.png"
            alt="Lumi AI"
            style={{ height: 24, objectFit: "contain" }}
          />
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
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                width: 2,
                height: 2,
                borderRadius: "50%",
                background: `rgba(255,107,44,${0.1 + Math.random() * 0.15})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -15 - Math.random() * 20, 0],
                opacity: [0.15, 0.5, 0.15],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>

        <div style={{ ...container, position: "relative", textAlign: "center" }}>
          {/* Kestrel logo */}
          <motion.div {...fadeUp} style={{ marginBottom: 28 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "linear-gradient(135deg, #FF6B2C, #FF8F5C)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 6,
                boxShadow: "0 8px 32px rgba(255,107,44,0.3)",
              }}
            >
              <img
                src="/kestrel-logo.png"
                alt="Kestrel"
                style={{ width: "100%", height: "100%", objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
            </div>
          </motion.div>

          <motion.h1
            {...fadeUpDelay(0.05)}
            style={{
              fontSize: "clamp(48px, 7vw, 80px)",
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 20,
              background: `linear-gradient(135deg, #fff 30%, ${ORANGE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            KESTREL SYMPHONY
          </motion.h1>

          <motion.p
            {...fadeUpDelay(0.1)}
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              fontWeight: 600,
              marginBottom: 56,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
            }}
          >
            AI-Native SDLC Orchestration Platform
          </motion.p>

          <motion.div
            {...fadeUpDelay(0.2)}
            style={{
              maxWidth: 700,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "clamp(20px, 2.5vw, 26px)",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.6,
                fontWeight: 400,
                marginBottom: 32,
              }}
            >
              Every developer has an AI assistant.
              <br />
              Individual productivity is solved.
            </p>
            <p
              style={{
                fontSize: "clamp(20px, 2.5vw, 26px)",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
                fontWeight: 400,
                marginBottom: 40,
              }}
            >
              But team-level delivery?
              <br />
              Still ungoverned. Still disconnected. Still invisible.
            </p>
            <div
              style={{
                width: 48,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
                margin: "0 auto 40px",
              }}
            />
            <p
              style={{
                fontSize: "clamp(18px, 2vw, 22px)",
                color: "#fff",
                lineHeight: 1.6,
                fontWeight: 600,
              }}
            >
              Symphony is the orchestration layer
              <br />
              between your backlog and your AI tools.
            </p>
          </motion.div>

          <motion.div
            {...fadeUpDelay(0.35)}
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 48,
            }}
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
              Talk to Us <ChevronRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── 2. THE GAP ────────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "#fff" }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            The Gap
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.1)}
            style={{ ...sectionTitle, color: "#1a1a1e", marginBottom: 56 }}
          >
            Individual AI is solved. Team AI is not.
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                heading: "Individual AI",
                status: "solved",
                color: "#22c55e",
                icon: <CheckCircle2 size={24} />,
                lines: [
                  "Every dev has Copilot, Cursor, or Claude Code.",
                  "Individual productivity is solved.",
                ],
              },
              {
                heading: "Team AI",
                status: "missing",
                color: "#ef4444",
                icon: <XCircle size={24} />,
                lines: [
                  "No cross-phase governance.",
                  "No cost visibility.",
                  "No audit trail for AI-generated code.",
                ],
              },
              {
                heading: "The Gap",
                status: "critical",
                color: ORANGE,
                icon: <Eye size={24} />,
                lines: [
                  "Context doesn't flow.",
                  "Quality isn't verified between handoffs.",
                  "Nobody knows what AI code is in production.",
                ],
              },
            ].map((col, i) => (
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <div style={{ color: col.color }}>{col.icon}</div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#1a1a1e",
                    }}
                  >
                    {col.heading}
                  </div>
                </div>
                {col.lines.map((line, li) => (
                  <p
                    key={li}
                    style={{
                      fontSize: 15,
                      color: "#6b6b76",
                      lineHeight: 1.65,
                      marginBottom: li < col.lines.length - 1 ? 8 : 0,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WHAT SYMPHONY DOES ─────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: LIGHT_GREY }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            The Solution
          </motion.p>
          <motion.h2 {...fadeUpDelay(0.1)} style={{ ...sectionTitle, color: "#1a1a1e" }}>
            The connective tissue between your backlog and your tools
          </motion.h2>
          <motion.p
            {...fadeUpDelay(0.15)}
            style={{ ...sectionDesc, color: "#6b6b76", marginBottom: 56 }}
          >
            Takes a Jira story, proposes a Blueprint, human approves, orchestrates
            execution across Plan, Design, Build, Deploy with automated quality
            gates between every phase.
          </motion.p>

          {/* Pipeline flow */}
          <motion.div
            {...fadeUpDelay(0.2)}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 0,
              marginBottom: 64,
            }}
          >
            {[
              { label: "Jira Story", icon: <FileText size={18} />, isTollgate: false },
              { label: "Blueprint", icon: <Layers size={18} />, isTollgate: false },
              { label: "Plan", icon: <Activity size={18} />, isTollgate: false },
              { label: "Tollgate", icon: <Shield size={18} />, isTollgate: true },
              { label: "Build", icon: <Cpu size={18} />, isTollgate: false },
              { label: "Tollgate", icon: <Shield size={18} />, isTollgate: true },
              { label: "Deploy", icon: <Zap size={18} />, isTollgate: false },
              { label: "Tollgate", icon: <Shield size={18} />, isTollgate: true },
              { label: "Cockpit", icon: <Eye size={18} />, isTollgate: false },
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: step.isTollgate ? "12px 14px" : "14px 16px",
                    background: step.isTollgate ? "rgba(255,107,44,0.08)" : "#fff",
                    border: step.isTollgate
                      ? `1.5px solid ${ORANGE}`
                      : "1px solid #e8e8ec",
                    borderRadius: step.isTollgate ? 20 : 10,
                    minWidth: step.isTollgate ? 90 : 100,
                  }}
                >
                  <div
                    style={{
                      color: step.isTollgate ? ORANGE : "#1a1a1e",
                      marginBottom: 4,
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
                </div>
                {i < 8 && (
                  <div style={{ padding: "0 4px", color: "#ccc" }}>
                    <ChevronRight size={14} />
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Three key points */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                title: "Not a replacement",
                desc: "Symphony doesn't replace Jira, GitHub, or Claude Code. It wires them together. Each tool keeps doing what it does best. Symphony is the connective tissue.",
                icon: <Plug size={22} />,
              },
              {
                title: "Quality gates, not speed bumps",
                desc: "Tollgates are automated. When they pass, context flows to the next phase. When they fail, work stops. No silent failures.",
                icon: <Shield size={22} />,
              },
              {
                title: "Full lifecycle visibility",
                desc: "Every decision, artifact, and cost in one Cockpit. Single dashboard from story intake to production.",
                icon: <Eye size={22} />,
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ ...stagger.transition, delay: i * 0.12 }}
                style={{
                  padding: 32,
                  background: "#fff",
                  border: "1px solid #e8e8ec",
                  borderRadius: 12,
                }}
              >
                <div style={{ color: ORANGE, marginBottom: 16 }}>{card.icon}</div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1a1a1e",
                    marginBottom: 10,
                  }}
                >
                  {card.title}
                </div>
                <p style={{ fontSize: 15, color: "#6b6b76", lineHeight: 1.65 }}>
                  {card.desc}
                </p>
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

          <div
            style={{
              perspective: 1200,
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {[
              {
                layer: "LAYER 3",
                name: "Kestrel Runtime",
                tagline: "The enterprise platform layer",
                bg: "#1a1a1e",
                color: "#fff",
                textMuted: "rgba(255,255,255,0.5)",
                textFeature: "rgba(255,255,255,0.7)",
                capabilities: [
                  "Deployment management",
                  "Cost tracking per story",
                  "Immutable audit logs",
                  "Enterprise admin",
                ],
                delay: 0.4,
                shadow: "0 -20px 60px rgba(0,0,0,0.3)",
                zIndex: 3,
              },
              {
                layer: "LAYER 2",
                name: "Arc Composer",
                tagline: '"Define it. Arc builds it."',
                bg: "#fff8f4",
                color: "#1a1a1e",
                textMuted: "#6b6b76",
                textFeature: "#555",
                capabilities: [
                  "Phase-tollgate sequencing",
                  "Weighted quality criteria",
                  "Advisory + enforced modes",
                  "Industry presets",
                ],
                delay: 0.25,
                shadow: "0 8px 40px rgba(255,107,44,0.12)",
                zIndex: 2,
                accentBorder: true,
              },
              {
                layer: "LAYER 1",
                name: "Role Cards",
                tagline: "The agent catalog. Composable, standalone plugins",
                bg: "#f7f7f9",
                color: "#1a1a1e",
                textMuted: "#6b6b76",
                textFeature: "#555",
                capabilities: [
                  "Requirements Dev",
                  "Process Leader",
                  "Agent Engineer",
                  "Code Auditor",
                  "Agent Ops",
                  "Data Steward",
                ],
                delay: 0.1,
                shadow: "0 4px 20px rgba(0,0,0,0.06)",
                zIndex: 1,
                isRoles: true,
              },
            ].map((layer, i) => (
              <motion.div key={i}>
                {/* Connector between layers */}
                {i > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: 2,
                        height: "100%",
                        background: `linear-gradient(to bottom, ${ORANGE}40, ${ORANGE}15)`,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: ORANGE,
                        opacity: 0.6,
                        background: "#fff",
                        padding: "2px 10px",
                        borderRadius: 100,
                        border: `1px solid rgba(255,107,44,0.15)`,
                      }}
                    >
                      {i === 1 ? "ORCHESTRATES" : "GOVERNS"}
                    </span>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: 8 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: layer.delay,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    background: layer.bg,
                    padding: "36px 40px",
                    borderRadius: 14,
                    boxShadow: layer.shadow,
                    position: "relative",
                    zIndex: layer.zIndex,
                    border: layer.accentBorder
                      ? `1.5px solid rgba(255,107,44,0.2)`
                      : layer.bg === "#1a1a1e"
                        ? "none"
                        : "1px solid #e8e8ec",
                    cursor: "default",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 24,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.15em",
                          color: layer.accentBorder ? ORANGE : layer.textMuted,
                          marginBottom: 8,
                          fontWeight: 700,
                        }}
                      >
                        {layer.layer}
                      </div>
                      <h3
                        style={{
                          fontSize: 24,
                          fontWeight: 700,
                          color: layer.color,
                          marginBottom: 4,
                        }}
                      >
                        {layer.name}
                      </h3>
                      <p style={{ fontSize: 13, color: layer.textMuted }}>
                        {layer.tagline}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: layer.isRoles ? 10 : 24,
                      }}
                    >
                      {layer.capabilities.map((c, ci) =>
                        layer.isRoles ? (
                          <div
                            key={ci}
                            style={{
                              padding: "10px 16px",
                              background: "#fff",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#1a1a1e",
                              border: "1px solid #e8e8ec",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            }}
                          >
                            {c}
                          </div>
                        ) : (
                          <div
                            key={ci}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: 13,
                              color: layer.textFeature,
                            }}
                          >
                            <CheckCircle2
                              size={14}
                              style={{ color: ORANGE }}
                            />
                            {c}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. ENGINE-AGNOSTIC ──────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "#fff" }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            No Vendor Lock-In
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.1)}
            style={{ ...sectionTitle, color: "#1a1a1e" }}
          >
            No vendor lock-in at any level
          </motion.h2>
          <motion.p
            {...fadeUpDelay(0.15)}
            style={{ ...sectionDesc, color: "#6b6b76", marginBottom: 56 }}
          >
            Symphony uses open protocols so every layer is swappable. Your choice
            of engine, LLM, and tools. Always.
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
                    label: "MCP",
                    desc: "Connects agents to tools",
                    items: "GitHub, Jira, Confluence, Snyk...",
                    icon: <Plug size={18} />,
                    protocol: "Model Context Protocol",
                  },
                  {
                    label: "A2A",
                    desc: "Agent-to-agent collaboration",
                    items: "Requirements Dev, Code Auditor...",
                    icon: <Users size={18} />,
                    protocol: "Agent-to-Agent Protocol",
                  },
                  {
                    label: "Engine",
                    desc: "Your orchestration framework",
                    items: "CrewAI / LangGraph / AutoGen / Claude SDK",
                    icon: <Settings size={18} />,
                    protocol: null,
                  },
                  {
                    label: "LLM",
                    desc: "Per-role optimization",
                    items: "Expensive model for architecture, fast model for code, open-source for internal",
                    icon: <Cpu size={18} />,
                    protocol: null,
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
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#1a1a1e",
                            }}
                          >
                            {row.label}
                          </span>
                          <span style={{ fontSize: 12, color: "#999" }}>
                            {row.desc}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                          {row.items}
                        </div>
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

            {/* Comparison Table — 3-column */}
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
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 12px",
                        fontWeight: 600,
                        color: "#1a1a1e",
                      }}
                    >
                      Capability
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "12px 12px",
                        fontWeight: 600,
                        color: ORANGE,
                      }}
                    >
                      Symphony
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "12px 12px",
                        fontWeight: 600,
                        color: "#999",
                      }}
                    >
                      DIY Frameworks
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "12px 12px",
                        fontWeight: 600,
                        color: "#999",
                      }}
                    >
                      Locked Platforms
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Engine choice", true, false, false],
                    ["Cross-phase governance", true, false, false],
                    ["LLM per-role routing", true, false, false],
                    ["MCP tool integration", true, true, false],
                    ["Cost tracking per story", true, false, true],
                    ["Audit trail", true, false, true],
                    ["Institutional memory", true, false, false],
                  ].map(([cap, sym, diy, locked], i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: "1px solid #f0f0f2" }}
                    >
                      <td
                        style={{
                          padding: "11px 12px",
                          color: "#1a1a1e",
                          fontWeight: 500,
                          fontSize: 13,
                        }}
                      >
                        {cap as string}
                      </td>
                      {[sym, diy, locked].map((val, vi) => (
                        <td
                          key={vi}
                          style={{
                            padding: "11px 12px",
                            textAlign: "center",
                          }}
                        >
                          {val ? (
                            <Check
                              size={16}
                              style={{
                                color: vi === 0 ? ORANGE : "#999",
                              }}
                            />
                          ) : (
                            <Minus size={16} style={{ color: "#ddd" }} />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. THREE COMPOUNDING ADVANTAGES ────────────────────────────────── */}
      <section
        style={{
          ...sectionPadding,
          background: DARK,
          color: "#fff",
        }}
      >
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            The Moat
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.1)}
            style={{ ...sectionTitle, color: "#fff", marginBottom: 56 }}
          >
            Three compounding advantages
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                num: "01",
                title: "Feedback Loop",
                icon: <RefreshCw size={24} />,
                body: "Production incidents and performance data flow back into planning. The team never repeats the same mistakes.",
              },
              {
                num: "02",
                title: "Knowledge Layer",
                icon: <Brain size={24} />,
                body: "Across hundreds of stories, Symphony detects patterns no individual tool can see. Which modules are fragile. Which changes cause incidents. Where AI estimates miss. This institutional memory is the long-term moat.",
              },
              {
                num: "03",
                title: "ROI Engine",
                icon: <BarChart3 size={24} />,
                body: "Every story shows before-and-after economics. Not projections \u2014 measured data from actual execution. Time saved. Cost reduced. Quality improved.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ ...stagger.transition, delay: i * 0.12 }}
                style={{
                  padding: 40,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 20,
                  }}
                >
                  <div style={{ color: ORANGE }}>{card.icon}</div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {card.num}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    marginBottom: 14,
                    color: "#fff",
                  }}
                >
                  {card.title}
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.7,
                  }}
                >
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. MARKET ─────────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "#fff" }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            Market
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.1)}
            style={{ ...sectionTitle, color: "#1a1a1e", marginBottom: 56 }}
          >
            The market is ready. The gap is clear.
          </motion.h2>

          {/* Big stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
              marginBottom: 64,
            }}
          >
            {[
              {
                stat: "$11B \u2192 $50B",
                label: "AI agent market 2026\u20132030",
                icon: <TrendingUp size={22} />,
              },
              {
                stat: "40%",
                label: "Enterprise apps with AI agents by year-end",
                icon: <Layers size={22} />,
              },
              {
                stat: "0",
                label: "Platforms providing governed, engine-agnostic SDLC orchestration",
                icon: <Eye size={22} />,
              },
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
                    color: ORANGE,
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: "#1a1a1e",
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  {item.stat}
                </div>
                <div style={{ fontSize: 14, color: "#6b6b76", lineHeight: 1.5 }}>
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Positioning statement */}
          <motion.div
            {...fadeUp}
            style={{
              background: "#f9f9fb",
              borderRadius: 16,
              padding: "40px 48px",
              border: "1px solid #e8e8ec",
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <p
              style={{
                fontSize: 17,
                color: "#555",
                lineHeight: 1.75,
              }}
            >
              Raw frameworks require engineers to build everything. Locked
              platforms tie you to one vendor. Nobody has built the governed
              composition layer that sits between the backlog and the tools
              : engine-agnostic, cross-phase, with built-in quality gates
              and institutional memory.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 8. THE PoC ────────────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: LIGHT_GREY }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            Proof of Concept
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.1)}
            style={{ ...sectionTitle, color: "#1a1a1e", marginBottom: 16 }}
          >
            See it work. Minutes. Single-digit dollars.
          </motion.h2>
          <motion.p
            {...fadeUpDelay(0.15)}
            style={{ ...sectionDesc, color: "#6b6b76", marginBottom: 56 }}
          >
            One story through the full pipeline proves the thesis.
          </motion.p>

          {/* Four steps */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
              marginBottom: 56,
            }}
          >
            {[
              {
                step: "1",
                title: "Story enters Symphony",
                timing: "Instant",
                desc: "One Jira story is ingested",
                icon: <FileText size={20} />,
              },
              {
                step: "2",
                title: "Blueprint proposed",
                timing: "30 seconds",
                desc: "Phases, roles, tools, cost. Human approves",
                icon: <Layers size={20} />,
              },
              {
                step: "3",
                title: "AI teams execute",
                timing: "8 minutes",
                desc: "Plan + Build phases run with agent coordination",
                icon: <Cpu size={20} />,
              },
              {
                step: "4",
                title: "Gates enforce governance",
                timing: "Visible",
                desc: "One gate passes, one fails and blocks. Governance in action",
                icon: <Shield size={20} />,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ ...stagger.transition, delay: i * 0.1 }}
                style={{
                  padding: 32,
                  background: "#fff",
                  border: "1px solid #e8e8ec",
                  borderRadius: 12,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    color: ORANGE,
                    letterSpacing: "0.04em",
                  }}
                >
                  {item.timing}
                </div>
                <div style={{ color: ORANGE, marginBottom: 14 }}>
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#999",
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                  }}
                >
                  STEP {item.step}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1a1a1e",
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </div>
                <p style={{ fontSize: 14, color: "#6b6b76", lineHeight: 1.55 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Cost callout + CTA */}
          <motion.div
            {...fadeUp}
            style={{ textAlign: "center" }}
          >
            <p
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#1a1a1e",
                marginBottom: 8,
              }}
            >
              Total cost: under $10.
            </p>
            <p
              style={{
                fontSize: 16,
                color: "#6b6b76",
                marginBottom: 32,
              }}
            >
              That&apos;s the proof the thesis works.
            </p>
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
          </motion.div>
        </div>
      </section>

      {/* ── 9. CLOSING ────────────────────────────────────────────────────── */}
      <section
        style={{
          ...sectionPadding,
          paddingTop: 120,
          paddingBottom: 120,
          background: DARK,
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ ...container, maxWidth: 860 }}>
          <motion.div {...fadeUp}>
            <p
              style={{
                fontSize: "clamp(20px, 3vw, 30px)",
                fontWeight: 400,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.6)",
                marginBottom: 40,
              }}
            >
              Today, organizations buy AI productivity per developer.
            </p>
            <p
              style={{
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 700,
                lineHeight: 1.35,
                color: "#fff",
                marginBottom: 16,
              }}
            >
              With Symphony, they buy AI productivity{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, #ff9a5c)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                per team
              </span>
            </p>
            <p
              style={{
                fontSize: "clamp(20px, 3vw, 30px)",
                fontWeight: 400,
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 56,
              }}
            >
              governed, auditable, engine-agnostic, and compounding.
            </p>
          </motion.div>

          <motion.div
            {...fadeUpDelay(0.15)}
            style={{
              width: 48,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
              margin: "0 auto 56px",
            }}
          />

          <motion.p
            {...fadeUpDelay(0.25)}
            style={{
              fontSize: "clamp(18px, 2.5vw, 24px)",
              fontWeight: 600,
              color: ORANGE,
              marginBottom: 72,
            }}
          >
            The IT team becomes the builder, not the buyer.
          </motion.p>

          <motion.div
            {...fadeUpDelay(0.35)}
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <img
                src="/lumi-logo-white.png"
                alt="Lumi AI"
                style={{ height: 20, objectFit: "contain", opacity: 0.6 }}
              />
            </div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              Lumi AI &middot;{" "}
              <a
                href="https://lumicorp.ai"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
              >
                lumicorp.ai
              </a>
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.3)",
                fontStyle: "italic",
              }}
            >
              &ldquo;Builders not consultants&rdquo;
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
