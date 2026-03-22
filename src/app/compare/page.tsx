"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

const sectionTitle: React.CSSProperties = {
  fontSize: "clamp(28px, 4vw, 42px)",
  fontWeight: 700,
  lineHeight: 1.15,
  marginBottom: 20,
};

// ─── Data ────────────────────────────────────────────────────────────────────

const gaps = [
  {
    number: "01",
    name: "Team Orchestration",
    problem:
      "AI works per developer, not per team. Ten developers with Copilot is ten independent AI sessions. No coordination, no shared context, no role specialization.",
    exists:
      "GitHub Copilot Workspace (multi-file from issues), Cursor Composer (multi-file edits), Devin (autonomous coding agent)",
    fallsShort:
      'Single agent, single phase. No concept of "Requirements Dev validates the spec, then Agent Engineer builds, then Code Auditor reviews." One AI doing everything vs. specialized roles doing what they do best.',
  },
  {
    number: "02",
    name: "Cross-Phase Governance",
    problem:
      "CI/CD governs the build step. But who governs that the Plan was validated before Build started? That Design was reviewed before code was written? That security passed before deployment?",
    exists:
      "GitHub Actions, Azure DevOps Pipelines, Jenkins (CI/CD). Branch protection rules. PR review requirements.",
    fallsShort:
      "Pipeline governance stops at code merge. No quality gates between planning and building. No tollgates between building and deploying. The entire lifecycle before and after the CI/CD step is ungoverned.",
  },
  {
    number: "03",
    name: "Per-Story Economics",
    problem:
      '"What did story NCP-1252 cost in AI compute vs. what the dev team would have charged?" Enterprises cannot answer this. No per-story, per-role, per-phase cost visibility.',
    exists:
      "Azure Cost Management, AWS Cost Explorer, OpenAI usage dashboard. LLM provider billing.",
    fallsShort:
      'These show cloud spend or API spend, not story economics. You see "$4,200 in OpenAI costs this month." You cannot see "$8.40 for this story, $12.10 for that story, 60% cheaper than the traditional estimate."',
  },
  {
    number: "04",
    name: "Institutional Memory",
    problem:
      "Each AI session starts from zero context. Story #247 learns nothing from stories #1 through #246. The same mistakes repeat. The same patterns go undetected.",
    exists:
      "RAG pipelines, vector databases (Pinecone, Weaviate), Retrieval-Augmented Generation. Knowledge bases.",
    fallsShort:
      'Retrieval is not learning. RAG can find similar documents, but it cannot detect: "Auth module stories fail security tollgate 37% of the time, so auto-add Code Auditor to Plan phase." Pattern detection across hundreds of stories with automatic guardrail evolution is fundamentally different from document search.',
  },
  {
    number: "05",
    name: "Engine Lock-in",
    problem:
      "Pick a framework, you are married to it. Pick a model provider, you are locked in. Enterprises need flexibility as the AI landscape shifts every quarter.",
    exists:
      "LangChain, CrewAI, LangGraph, AutoGen, Semantic Kernel. Each is an excellent framework.",
    fallsShort:
      "Frameworks assume one engine and often one model provider. Switching from CrewAI to LangGraph means rewriting your orchestration. Switching from OpenAI to Claude means updating every prompt. The composition layer should be engine-agnostic so the customer picks what fits, and can change their mind later.",
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

const compoundCards = [
  {
    title: "Feedback Loop",
    body: "Production incidents and performance data flow back into the planning phase of future related work. The team never repeats the same mistakes. Sprint 1 informs Sprint 2. Story #200 is smarter than Story #1.",
  },
  {
    title: "Knowledge Layer",
    body: "Across hundreds of stories, Symphony detects patterns no individual tool can see: which modules are fragile, which change combinations cause incidents, where AI estimates consistently miss. This institutional memory is the long-term moat.",
  },
  {
    title: "ROI Engine",
    body: "Every story shows before-and-after economics. Time saved, cost reduced, quality improved. Not projections. Measured data from actual execution. Your CFO gets a dashboard, not a spreadsheet.",
  },
];

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ComparePage() {
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
          <a href="https://lumicorp.ai" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/lumi-logo-white.png"
              alt="Lumi AI"
              style={{ height: 24, objectFit: "contain" }}
            />
          </a>
          <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a
              href="/pitch"
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Architecture
            </a>
            <a
              href="/"
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Live Demo
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
        <div style={container}>
          <motion.h1
            {...fadeUp}
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.08,
              maxWidth: 800,
              marginBottom: 32,
              letterSpacing: "-0.02em",
            }}
          >
            AI productivity is solved per developer.
            <br />
            <span style={{ color: "rgba(255,255,255,0.45)" }}>
              Not per team. Here&apos;s why.
            </span>
          </motion.h1>
          <motion.p
            {...fadeUpDelay(0.15)}
            style={{
              fontSize: "clamp(17px, 2vw, 20px)",
              lineHeight: 1.7,
              maxWidth: 640,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Every developer has an AI coding assistant. Code gets written faster.
            That&apos;s real. But when you zoom out from one developer to a team
            delivering a project, nothing has changed.
          </motion.p>
        </div>
      </section>

      {/* ── 2. THE FIVE GAPS ────────────────────────────────────────────── */}
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
            }}
          >
            The Problem
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.05)}
            style={{ ...sectionTitle, marginBottom: 64 }}
          >
            Five structural gaps no current tool addresses
          </motion.h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {gaps.map((gap, i) => (
              <motion.div
                key={gap.number}
                {...stagger(i * 0.08)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: 32,
                  paddingBottom: i < gaps.length - 1 ? 56 : 0,
                  borderBottom:
                    i < gaps.length - 1 ? "1px solid #eee" : "none",
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: ORANGE,
                    lineHeight: 1,
                    opacity: 0.85,
                  }}
                >
                  {gap.number}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      marginBottom: 16,
                    }}
                  >
                    {gap.name}
                  </h3>

                  <div style={{ marginBottom: 16 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#999",
                        marginBottom: 6,
                      }}
                    >
                      The Problem
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        lineHeight: 1.65,
                        color: "#333",
                        maxWidth: 720,
                      }}
                    >
                      {gap.problem}
                    </p>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#999",
                        marginBottom: 6,
                      }}
                    >
                      What Exists Today
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        lineHeight: 1.65,
                        color: "#333",
                        maxWidth: 720,
                      }}
                    >
                      {gap.exists}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#999",
                        marginBottom: 6,
                      }}
                    >
                      Why It Falls Short
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        lineHeight: 1.65,
                        color: "#555",
                        maxWidth: 720,
                      }}
                    >
                      {gap.fallsShort}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WHERE SYMPHONY FITS ──────────────────────────────────────── */}
      <section style={{ ...sectionPadding, background: LIGHT_GREY }}>
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

            {/* Connector */}
            <div
              style={{
                width: 2,
                height: 32,
                background: "#ccc",
              }}
            />

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
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                Governed Composition
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Role Catalog + Arc Composer + Kestrel Runtime
              </p>
            </div>

            {/* Connector */}
            <div
              style={{
                width: 2,
                height: 32,
                background: "#ccc",
              }}
            />

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

      {/* ── 4. STACK COMPATIBILITY ──────────────────────────────────────── */}
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
            }}
          >
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
              fontSize: 17,
              lineHeight: 1.65,
              color: "#555",
              maxWidth: 720,
              marginTop: 48,
            }}
          >
            Your CTO picked Azure and GitHub? Symphony runs on Azure and
            integrates with GitHub. Your team prefers Claude and CrewAI? Symphony
            uses Claude and CrewAI. The stack is yours to choose.
          </motion.p>
        </div>
      </section>

      {/* ── 5. WHAT COMPOUNDS ───────────────────────────────────────────── */}
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
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 32,
            }}
          >
            {compoundCards.map((card, i) => (
              <motion.div
                key={card.title}
                {...stagger(i * 0.1)}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: 32,
                }}
              >
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: "#fff",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA ──────────────────────────────────────────────────────── */}
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
              href="/pitch"
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                background: "transparent",
                padding: "12px 28px",
                borderRadius: 8,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Read the architecture
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
