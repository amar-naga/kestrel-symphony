"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { generateBlueprint, SAMPLE_STORIES } from "@/lib/sample-data";
import {
  Bug,
  Lightbulb,
  Zap,
  BookOpen,
  ArrowRight,
  Check,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";
import type { JiraStory, StoryStatus, StoryType, StoryPriority, PhaseStatus } from "@/lib/store";

/* ================================================================
   CONSTANTS
   ================================================================ */

const COLUMNS: { status: StoryStatus; label: string; color: string }[] = [
  { status: "backlog", label: "Backlog", color: "#6b7280" },
  { status: "ready", label: "Ready", color: "#999999" },
  { status: "in_symphony", label: "In Symphony", color: "#FF6B2C" },
  { status: "done", label: "Done", color: "#4ade80" },
];

const TYPE_CONFIG: Record<StoryType, { icon: React.ReactNode; bg: string; text: string; label: string }> = {
  feature: { icon: <Lightbulb size={12} />, bg: "rgba(255,107,44,0.15)", text: "#FF8F5C", label: "Feature" },
  bug: { icon: <Bug size={12} />, bg: "rgba(248,113,113,0.15)", text: "#f87171", label: "Bug" },
  spike: { icon: <Zap size={12} />, bg: "rgba(251,191,36,0.15)", text: "#fbbf24", label: "Spike" },
  epic: { icon: <BookOpen size={12} />, bg: "rgba(255,107,44,0.15)", text: "#FF6B2C", label: "Epic" },
};

const PRIORITY_COLORS: Record<StoryPriority, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#6b7280",
};

const PHASE_STATUS_COLOR: Record<PhaseStatus, string> = {
  passed: "#4ade80",
  active: "#FF6B2C",
  failed: "#f87171",
  pending: "#4b5563",
  skipped: "#6b7280",
};

/* ================================================================
   MINI PIPELINE (inline phase dots for in_symphony cards)
   ================================================================ */

function MiniPipeline({ phases }: { phases: NonNullable<JiraStory["phases"]> }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, padding: "8px 0 2px" }}>
      {phases.map((phase, i) => {
        const color = PHASE_STATUS_COLOR[phase.status];
        const isActive = phase.status === "active";
        const isPassed = phase.status === "passed";
        const isFailed = phase.status === "failed";

        return (
          <div key={phase.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Phase dot */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <motion.div
                animate={isActive ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : {}}
                transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: color,
                  boxShadow: isActive ? `0 0 8px ${color}` : "none",
                }}
              />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {phase.name}
                {isPassed && " \u2713"}
                {isActive && " \ud83d\udd04"}
                {isFailed && " \u2717"}
              </span>
            </div>

            {/* Arrow between phases */}
            {i < phases.length - 1 && (
              <span className="text-white/25 mx-0.5"><ArrowRight size={10} /></span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================
   STORY CARD
   ================================================================ */

function StoryCard({ story, onPull, onOpen }: { story: JiraStory; onPull?: () => void; onOpen?: () => void }) {
  const typeConfig = TYPE_CONFIG[story.type];
  const priorityColor = PRIORITY_COLORS[story.priority];
  const isInSymphony = story.status === "in_symphony";
  const isDone = story.status === "done";
  const isReady = story.status === "ready";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      onClick={isInSymphony ? onOpen : undefined}
      style={{
        background: "var(--surface-primary)",
        border: "1px solid var(--border-primary)",
        borderRadius: 16,
        padding: 16,
        cursor: isInSymphony ? "pointer" : "default",
        position: "relative",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      whileHover={isInSymphony ? { borderColor: "rgba(255,107,44,0.4)", y: -2 } : {}}
    >
      {/* Header: key + priority */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", fontFamily: "monospace" }}>
          {story.key}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isDone && <span className="text-emerald-500"><Check size={14} /></span>}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: priorityColor,
              boxShadow: story.priority === "critical" ? `0 0 6px ${priorityColor}` : "none",
            }}
            title={story.priority}
          />
        </div>
      </div>

      {/* Title */}
      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.4, margin: 0, marginBottom: 10 }}>
        {story.title}
      </p>

      {/* Type badge + component + story points */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {/* Type badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: 9999,
            background: typeConfig.bg,
            color: typeConfig.text,
          }}
        >
          {typeConfig.icon}
          {typeConfig.label}
        </span>

        {/* Component tag */}
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 9999,
            background: "var(--surface-primary)",
            color: "var(--text-muted)",
          }}
        >
          {story.component}
        </span>

        {/* Story points */}
        {story.storyPoints && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: 4,
              background: "var(--surface-primary)",
              color: "var(--text-muted)",
              marginLeft: "auto",
            }}
          >
            {story.storyPoints} SP
          </span>
        )}
      </div>

      {/* Mini pipeline for in_symphony stories */}
      {isInSymphony && story.phases && <MiniPipeline phases={story.phases} />}

      {/* Pull into Symphony button for ready stories */}
      {isReady && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onPull?.();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            marginTop: 12,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 0",
            borderRadius: 10,
            border: "1px solid rgba(255,107,44,0.3)",
            background: "rgba(255,107,44,0.1)",
            color: "#FF8F5C",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          Pull into Symphony
          <ArrowRight size={14} />
        </motion.button>
      )}
    </motion.div>
  );
}

/* ================================================================
   BOARD VIEW (main export)
   ================================================================ */

export function BoardView() {
  const { state, dispatch } = useApp();

  /* Initialize stories on mount with pre-attached blueprints */
  useEffect(() => {
    if (state.stories.length === 0) {
      const storiesWithBlueprints = SAMPLE_STORIES.map((story) => {
        // Stories that already have blueprints (in_symphony) keep them
        if (story.blueprint) return story;
        // Pre-generate blueprints for ready stories
        if (story.status === "ready") {
          return { ...story, blueprint: generateBlueprint(story) };
        }
        return story;
      });
      dispatch({ type: "INIT_STORIES", stories: storiesWithBlueprints });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Pull a story into Symphony */
  const handlePull = (story: JiraStory) => {
    dispatch({ type: "PULL_STORY", storyId: story.id });
    dispatch({ type: "SET_ACTIVE_STORY", storyId: story.id });
    dispatch({ type: "SET_VIEW", view: "blueprint" });
  };

  /* Open an in-symphony story */
  const handleOpen = (story: JiraStory) => {
    dispatch({ type: "SET_ACTIVE_STORY", storyId: story.id });
    dispatch({ type: "SET_VIEW", view: "session" });
  };

  /* Count stories per column */
  const countByStatus = (status: StoryStatus) =>
    state.stories.filter((s) => s.status === status).length;

  return (
    <div style={{ width: "100%", minHeight: "100vh", padding: "32px 24px" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #FF6B2C, #FF8F5C)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            N
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            NextGen Customer Portal
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 44 }}>
          <span className="text-white/40"><Clock size={13} /></span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Sprint 14 &middot; Mar 10&ndash;24, 2026
          </span>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 9999,
              background: "rgba(255,107,44,0.15)",
              color: "#FF8F5C",
              marginLeft: 8,
            }}
          >
            {countByStatus("in_symphony")} in Symphony
          </span>
        </div>
      </div>

      {/* ── Kanban Columns ─────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          alignItems: "start",
        }}
      >
        {COLUMNS.map((col) => {
          const stories = state.stories.filter((s) => s.status === col.status);

          return (
            <div
              key={col.status}
              style={{
                background: "var(--surface-secondary)",
                border: "1px solid var(--border-secondary)",
                borderRadius: 20,
                padding: 16,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                minHeight: 200,
              }}
            >
              {/* Column header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  paddingBottom: 12,
                  borderBottom: "1px solid var(--border-secondary)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: col.color,
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                    {col.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 9999,
                    background: `${col.color}20`,
                    color: col.color,
                  }}
                >
                  {stories.length}
                </span>
              </div>

              {/* Story cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <AnimatePresence mode="popLayout">
                  {stories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onPull={() => handlePull(story)}
                      onOpen={() => handleOpen(story)}
                    />
                  ))}
                </AnimatePresence>

                {stories.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "24px 12px",
                      color: "var(--text-ghost)",
                      fontSize: 12,
                    }}
                  >
                    No stories
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BoardView;
