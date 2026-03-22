"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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

const stagger = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

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

// ─── SVG Icon Components ─────────────────────────────────────────────────────

const O = "#FF6B2C";
const O40 = "rgba(255,107,44,0.4)";
const O25 = "rgba(255,107,44,0.25)";

function OrchestrationIcon() {
  return (
    <svg width="100%" height="64" viewBox="0 0 160 64" fill="none">
      <circle cx="30" cy="20" r="8" fill="#e5e5e5" />
      <circle cx="80" cy="16" r="8" fill={O40} />
      <circle cx="130" cy="22" r="8" fill="#e5e5e5" />
      <circle cx="55" cy="46" r="8" fill="#e5e5e5" />
      <circle cx="105" cy="48" r="8" fill="#e5e5e5" />
      <line x1="38" y1="22" x2="72" y2="18" stroke="#d0d0d0" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="88" y1="18" x2="122" y2="22" stroke={O25} strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="35" y1="27" x2="50" y2="40" stroke="#d0d0d0" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="63" y1="46" x2="97" y2="48" stroke="#d0d0d0" strokeWidth="1.5" strokeDasharray="4 4" />
    </svg>
  );
}

function GovernanceIcon() {
  return (
    <svg width="100%" height="64" viewBox="0 0 160 64" fill="none">
      <rect x="8" y="24" width="40" height="16" rx="4" fill="#e5e5e5" />
      <rect x="112" y="24" width="40" height="16" rx="4" fill="#e5e5e5" />
      <line x1="52" y1="32" x2="108" y2="32" stroke="#d0d0d0" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="78" y1="12" x2="78" y2="24" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="12" x2="82" y2="24" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
      <line x1="78" y1="40" x2="78" y2="52" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="40" x2="82" y2="52" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
      <text x="80" y="36" textAnchor="middle" fontSize="14" fill={O} fontWeight="700">?</text>
    </svg>
  );
}

function EconomicsIcon() {
  return (
    <svg width="100%" height="64" viewBox="0 0 160 64" fill="none">
      <rect x="48" y="6" width="64" height="52" rx="6" fill="#f0f0f0" stroke="#e0e0e0" strokeWidth="1" />
      <line x1="58" y1="18" x2="102" y2="18" stroke="#ddd" strokeWidth="2" strokeLinecap="round" />
      <line x1="58" y1="26" x2="90" y2="26" stroke="#ddd" strokeWidth="2" strokeLinecap="round" />
      <line x1="58" y1="34" x2="96" y2="34" stroke="#ddd" strokeWidth="2" strokeLinecap="round" />
      <text x="80" y="50" textAnchor="middle" fontSize="11" fill={O} fontWeight="600">$?.??</text>
    </svg>
  );
}

function MemoryIcon() {
  return (
    <svg width="100%" height="64" viewBox="0 0 160 64" fill="none">
      <circle cx="80" cy="32" r="22" fill="#f0f0f0" stroke="#e0e0e0" strokeWidth="1" />
      <path d="M 60 15 A 28 28 0 1 1 55 38" stroke={O40} strokeWidth="2" fill="none" strokeLinecap="round" />
      <polygon points="56,12 64,16 58,20" fill={O40} />
      <text x="80" y="37" textAnchor="middle" fontSize="16" fill={O} fontWeight="700">0</text>
    </svg>
  );
}

function LockInIcon() {
  return (
    <svg width="100%" height="64" viewBox="0 0 160 64" fill="none">
      <rect x="28" y="20" width="28" height="24" rx="12" fill="none" stroke="#d5d5d5" strokeWidth="2" />
      <rect x="50" y="20" width="28" height="24" rx="12" fill="none" stroke="#d5d5d5" strokeWidth="2" />
      <rect x="72" y="20" width="28" height="24" rx="12" fill="none" stroke="#d5d5d5" strokeWidth="2" />
      <rect x="110" y="28" width="20" height="16" rx="3" fill={O25} />
      <path d="M 114 28 L 114 22 A 6 6 0 0 1 126 22 L 126 28" stroke={O40} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="120" cy="36" r="2" fill={O} />
    </svg>
  );
}

function FeedbackIcon() {
  return (
    <svg width="100%" height="64" viewBox="0 0 160 64" fill="none">
      <path d="M 60 32 A 24 24 0 1 1 100 32" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 100 32 A 24 24 0 1 1 60 32" stroke={O} strokeWidth="2" fill="none" strokeLinecap="round" />
      <polygon points="58,26 66,32 58,38" fill={O} />
      <text x="52" y="36" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)" fontWeight="700">S1</text>
      <text x="108" y="36" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)" fontWeight="700">S2</text>
    </svg>
  );
}

function KnowledgeIcon() {
  return (
    <svg width="100%" height="64" viewBox="0 0 160 64" fill="none">
      <circle cx="50" cy="20" r="6" fill={O40} />
      <circle cx="80" cy="14" r="6" fill="rgba(255,255,255,0.3)" />
      <circle cx="110" cy="22" r="6" fill="rgba(255,255,255,0.3)" />
      <circle cx="65" cy="46" r="6" fill="rgba(255,255,255,0.3)" />
      <circle cx="95" cy="48" r="6" fill={O40} />
      <line x1="55" y1="22" x2="75" y2="16" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <line x1="85" y1="16" x2="105" y2="22" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <line x1="53" y1="25" x2="62" y2="41" stroke={O40} strokeWidth="1.5" />
      <line x1="70" y1="46" x2="90" y2="48" stroke={O40} strokeWidth="1.5" />
      <line x1="98" y1="43" x2="108" y2="27" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
    </svg>
  );
}

function RoiIcon() {
  return (
    <svg width="100%" height="64" viewBox="0 0 160 64" fill="none">
      <rect x="40" y="14" width="18" height="40" rx="3" fill="rgba(255,255,255,0.25)" />
      <rect x="70" y="28" width="18" height="26" rx="3" fill={O} />
      <text x="60" y="54" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.4)">&#8595;</text>
      <text x="115" y="38" textAnchor="middle" fontSize="16" fill={O} fontWeight="700">60%</text>
      <text x="115" y="50" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)" fontWeight="600">saved</text>
    </svg>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const gapIcons = [OrchestrationIcon, GovernanceIcon, EconomicsIcon, MemoryIcon, LockInIcon];

const gaps = [
  {
    category: "TEAM DELIVERY",
    name: "Orchestration",
    description:
      "AI works per developer, not per team. Ten Copilot sessions is not a coordinated team. No shared context, no role specialization, no handoffs.",
  },
  {
    category: "GOVERNANCE",
    name: "Cross-Phase Gates",
    description:
      "CI/CD governs the build step. Nobody governs Plan to Build to Deploy. The entire lifecycle before and after code merge is ungoverned.",
  },
  {
    category: "ECONOMICS",
    name: "Per-Story Costs",
    description:
      "You see monthly API spend. Not what each story cost vs. traditional. No per-story, per-role, per-phase cost visibility for your CFO.",
  },
  {
    category: "INTELLIGENCE",
    name: "Institutional Memory",
    description:
      "Every AI session starts from zero. Story #247 learns nothing from #1 through #246. The same mistakes repeat. The same patterns go undetected.",
  },
  {
    category: "FLEXIBILITY",
    name: "Engine Choice",
    description:
      "Pick a framework, you are married to it. Pick a model, you are locked in. The AI landscape shifts every quarter. Your orchestration layer should not.",
  },
];

const integrations: { category: string; tools: string[] }[] = [
  { category: "Backlogs", tools: ["Jira", "Linear", "Azure Boards", "GitHub Issues"] },
  { category: "Repositories", tools: ["GitHub", "GitLab", "Bitbucket"] },
  {
    category: "LLMs",
    tools: ["Claude (Anthropic)", "GPT-4o (OpenAI)", "Gemini (Google)", "Llama (Meta)", "Mistral"],
  },
  {
    category: "Orchestration Engines",
    tools: ["CrewAI", "LangGraph", "AutoGen", "Claude Agent SDK"],
  },
  { category: "Cloud", tools: ["AWS", "Azure", "GCP", "On-premises"] },
  {
    category: "CI/CD",
    tools: ["GitHub Actions", "Azure Pipelines", "Jenkins", "GitLab CI"],
  },
  { category: "Observability", tools: ["Langfuse", "LangSmith", "Datadog"] },
];

const compoundIcons = [FeedbackIcon, KnowledgeIcon, RoiIcon];

const compoundCards = [
  {
    category: "LEARNING",
    title: "Feedback Loop",
    body: "Production data flows back to planning. Sprint 1 informs Sprint 2. The team never repeats the same mistakes.",
  },
  {
    category: "PATTERNS",
    title: "Knowledge Layer",
    body: "Detects patterns across hundreds of stories. Fragile modules, risky changes, estimate misses. Institutional memory.",
  },
  {
    category: "MEASUREMENT",
    title: "ROI Engine",
    body: "Every story shows before-and-after economics. Measured data, not projections. Your CFO gets a dashboard.",
  },
];

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
      {/* ── Header ────────────────────────────────────────────────────────── */}
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
          <a href="https://lumicorp.ai" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/lumi-logo-white.png"
              alt="Lumi AI"
              style={{ height: 24, objectFit: "contain" }}
            />
          </a>
          <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a
              href="/"
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              View Live Demo
            </a>
            <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)" }} />
            <a
              href="https://lumicorp.ai"
              style={{
                fontSize: 13,
                color: ORANGE,
                textDecoration: "none",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Talk to Us <ArrowRight size={14} />
            </a>
          </nav>
        </div>
      </header>

      {/* ── 1. HERO (dark bg) ─────────────────────────────────────────────── */}
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
          {/* Kestrel logo with floating dots */}
          <motion.div {...fadeUp} style={{ marginBottom: 28 }}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "relative", display: "inline-block" }}
            >
              {/* Slow floating dots */}
              {[
                { size: 5, color: "#FF6B2C", opacity: 0.85, duration: 14, delay: 0,
                  x: [20, 50, 30, -40, -50, -20, 20],
                  y: [-70, -30, 20, 30, -10, -50, -70] },
                { size: 4, color: "#FF8F5C", opacity: 0.6, duration: 18, delay: 3,
                  x: [-30, -50, -20, 40, 55, 25, -30],
                  y: [-65, -15, 35, 20, -25, -55, -65] },
                { size: 3, color: "#FF6B2C", opacity: 0.45, duration: 16, delay: 6,
                  x: [45, 15, -35, -45, -10, 35, 45],
                  y: [-60, -20, 10, -15, -45, -55, -60] },
              ].map((dot, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    width: dot.size,
                    height: dot.size,
                    borderRadius: "50%",
                    background: dot.color,
                    opacity: dot.opacity,
                    boxShadow: `0 0 ${dot.size * 3}px ${dot.color}60`,
                    top: "50%",
                    left: "50%",
                    marginTop: -dot.size / 2,
                    marginLeft: -dot.size / 2,
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

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #FF6B2C, #FF8F5C, #CC5623)",
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
          </motion.div>
        </div>
      </section>

      {/* ── 2. THE FIVE GAPS (white bg) ───────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "#fff" }}>
        <div style={container}>
          <motion.p
            {...fadeUp}
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: ORANGE,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            The Problem
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.05)}
            style={{ ...sectionTitle, marginBottom: 56, textAlign: "center" }}
          >
            Five gaps no current tool addresses
          </motion.h2>

          {/* Card grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 20,
              marginBottom: 48,
            }}
          >
            {gaps.map((gap, i) => (
              <motion.div
                key={gap.name}
                {...stagger(i * 0.08)}
                style={{
                  background: "#fafafa",
                  borderRadius: 16,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  border: "1px solid #f0f0f0",
                  transition: "box-shadow 0.3s, transform 0.3s",
                }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#999",
                  }}
                >
                  {gap.category}
                </p>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#1a1a1e",
                    lineHeight: 1.2,
                  }}
                >
                  {gap.name}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "#666",
                  }}
                >
                  {gap.description}
                </p>
                <div style={{ marginTop: "auto", paddingTop: 12 }}>
                  {(() => { const Icon = gapIcons[i]; return <Icon />; })()}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...fadeUpDelay(0.4)}
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: "#555",
              textAlign: "center",
              maxWidth: 680,
              margin: "0 auto",
              fontStyle: "italic",
            }}
          >
            Copilot, Cursor, and Claude Code are excellent at what they do.
            The gap is what happens between sessions.
          </motion.p>
        </div>
      </section>

      {/* ── 3. WHERE SYMPHONY FITS (light grey bg) ────────────────────────── */}
      <section style={{ ...sectionPadding, background: LIGHT_GREY }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            The Solution
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.05)}
            style={{ ...sectionTitle, marginBottom: 64 }}
          >
            The missing layer
          </motion.h2>

          {/* Diagram */}
          <motion.div
            {...fadeUpDelay(0.1)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              marginBottom: 64,
            }}
          >
            {/* Top: Backlog */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: "20px 40px",
                textAlign: "center",
                minWidth: 320,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#999",
                  marginBottom: 8,
                }}
              >
                Your Backlog
              </p>
              <p style={{ fontSize: 15, color: "#555", fontWeight: 500 }}>
                Jira &nbsp;|&nbsp; Linear &nbsp;|&nbsp; Azure Boards
              </p>
            </div>

            <div style={{ width: 2, height: 32, background: "#ccc" }} />

            {/* Symphony Box */}
            <div
              style={{
                background: DARK,
                color: "#fff",
                borderRadius: 16,
                padding: "32px 48px",
                textAlign: "center",
                minWidth: 320,
                border: `2px solid ${ORANGE}`,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: ORANGE,
                  marginBottom: 8,
                }}
              >
                Kestrel Symphony
              </p>
              <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                Governed Composition
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                Role Catalog + Arc Composer + Kestrel Runtime
              </p>
            </div>

            <div style={{ width: 2, height: 32, background: "#ccc" }} />

            {/* Bottom: Tools */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: "20px 40px",
                textAlign: "center",
                minWidth: 320,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#999",
                  marginBottom: 8,
                }}
              >
                Your Tools &amp; Infrastructure
              </p>
              <p style={{ fontSize: 15, color: "#555", fontWeight: 500 }}>
                GitHub &nbsp;|&nbsp; AWS &nbsp;|&nbsp; CI/CD &nbsp;|&nbsp; LLMs
              </p>
            </div>
          </motion.div>

          {/* Three bullets */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            {[
              "Symphony does not replace your backlog. It reads from it.",
              "Symphony does not replace your AI tools. It orchestrates them.",
              "Symphony does not replace your infrastructure. It runs on it.",
            ].map((text, i) => (
              <motion.p
                key={i}
                {...stagger(0.15 + i * 0.08)}
                style={{
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: "#333",
                  paddingLeft: 20,
                  borderLeft: `3px solid ${ORANGE}`,
                }}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. 3-LAYER ARCHITECTURE (white bg) ────────────────────────────── */}
      <section id="architecture" style={{ ...sectionPadding, background: "#fff" }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            Architecture
          </motion.p>
          <motion.h2 {...fadeUpDelay(0.1)} style={{ ...sectionTitle, color: "#1a1a1e" }}>
            Three-layer composable platform
          </motion.h2>
          <motion.p
            {...fadeUpDelay(0.15)}
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              maxWidth: 680,
              color: "#6b6b76",
              marginBottom: 56,
            }}
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

      {/* ── 5. STACK COMPATIBILITY (white bg) ─────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "#fff" }}>
        <div style={container}>
          <motion.p {...fadeUp} style={sectionLabel}>
            Compatibility
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.05)}
            style={{ ...sectionTitle, marginBottom: 56 }}
          >
            Works with what you already have
          </motion.h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {integrations.map((row, ri) => (
              <motion.div
                key={row.category}
                {...stagger(ri * 0.06)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#999",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {row.category}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {row.tools.map((tool) => (
                    <span
                      key={tool}
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#444",
                        padding: "6px 14px",
                        borderRadius: 20,
                        border: "1px solid #e0e0e0",
                        background: "#fafafa",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...fadeUpDelay(0.3)}
            style={{
              fontSize: 18,
              lineHeight: 1.5,
              color: "#1a1a1e",
              fontWeight: 600,
              maxWidth: 600,
              marginTop: 48,
              textAlign: "center",
              margin: "48px auto 0",
            }}
          >
            The stack is yours to choose. Symphony runs on it.
          </motion.p>
        </div>
      </section>

      {/* ── 6. COMPOUNDING VALUE (dark bg) ────────────────────────────────── */}
      <section
        style={{
          ...sectionPadding,
          background: DARK,
          color: "#fff",
        }}
      >
        <div style={container}>
          <motion.p
            {...fadeUp}
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: ORANGE,
              marginBottom: 16,
            }}
          >
            Compounding Value
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.05)}
            style={{
              ...sectionTitle,
              color: "#fff",
              marginBottom: 56,
            }}
          >
            Three things that get better with every story
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {compoundCards.map((card, i) => {
              const Icon = compoundIcons[i];
              return (
                <motion.div
                  key={card.title}
                  {...stagger(i * 0.1)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 16,
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    transition: "border-color 0.3s",
                  }}
                  whileHover={{
                    borderColor: "rgba(255,107,44,0.4)",
                    y: -6,
                    boxShadow: "0 12px 40px rgba(255,107,44,0.15), 0 0 0 1px rgba(255,107,44,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {card.category}
                  </p>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#fff",
                      lineHeight: 1.2,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {card.body}
                  </p>
                  <div style={{ marginTop: "auto", paddingTop: 8 }}>
                    <Icon />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. ROI (white bg) ─────────────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: "#fff" }}>
        <div style={container}>
          <motion.p {...fadeUp} style={{ ...sectionLabel, textAlign: "center" }}>
            Measured Results
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.05)}
            style={{ ...sectionTitle, textAlign: "center", marginBottom: 56 }}
          >
            Conservative, defensible ROI
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              marginBottom: 40,
            }}
          >
            {[
              { stat: "60%", label: "Time reduction per story" },
              { stat: "60%", label: "Cost reduction vs. traditional" },
              { stat: "8 weeks", label: "From concept to production" },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...stagger(i * 0.1)}
                style={{
                  padding: 48,
                  textAlign: "center",
                  border: "1px solid #e8e8ec",
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: "#1a1a1e",
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {item.stat}
                </div>
                <div style={{ fontSize: 15, color: "#6b6b76", lineHeight: 1.5 }}>
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...fadeUpDelay(0.3)}
            style={{
              fontSize: 15,
              color: "#888",
              textAlign: "center",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Measured from actual story execution, not projections.
            Every story records before-and-after economics in the Cockpit.
          </motion.p>
        </div>
      </section>

      {/* ── 8. CTA + FOOTER (dark bg) ─────────────────────────────────────── */}
      <section
        style={{
          ...sectionPadding,
          paddingTop: 80,
          paddingBottom: 80,
          background: DARK,
          color: "#fff",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            ...container,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 40,
          }}
        >
          <motion.div
            {...fadeUp}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
            }}
          >
            <a
              href="/"
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                background: ORANGE,
                padding: "12px 28px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              See it work <ArrowRight size={16} />
            </a>
            <a
              href="https://lumicorp.ai"
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
                padding: "12px 28px",
                textDecoration: "none",
              }}
            >
              Talk to us
            </a>
          </motion.div>

          <motion.div
            {...fadeUpDelay(0.15)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
            }}
          >
            <img
              src="/lumi-logo-white.png"
              alt="Lumi AI"
              style={{ height: 20, opacity: 0.5 }}
            />
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Confidential. Demo Build v0.5
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
